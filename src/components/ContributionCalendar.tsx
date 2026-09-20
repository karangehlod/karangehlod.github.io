import { useRef, useState } from 'react';
import type { ActivityDataset } from '../hooks/useActivity';

// Sequential telemetry-green ramp — steps defined per theme in index.css
// (validated ordinal ramp: monotone lightness, visible step gaps)
const LEVEL_BG: Record<number, string> = {
  0: 'var(--cal-0)',
  1: 'var(--cal-1)',
  2: 'var(--cal-2)',
  3: 'var(--cal-3)',
  4: 'var(--cal-4)',
};

// Day labels: show Mon (1), Wed (3), Fri (5) only
const DAY_LABEL_INDICES = new Set([1, 3, 5]);
const DAY_LABELS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

// Cell = 10px, gap = 3px, step per column = 13px (kept as JS constants for computed positioning)
const STEP = 13;

interface Props {
  dataset: ActivityDataset;
}

interface Tip {
  x: number;
  y: number;
  label: string;
}

export function ContributionCalendar({ dataset }: Props) {
  const { weeks, totalContributions, totalCommits, totalPRs, longestStreak, currentStreak } = dataset;
  const wrapRef = useRef<HTMLDivElement>(null);
  const [tip, setTip] = useState<Tip | null>(null);

  const showTip = (e: React.MouseEvent<HTMLDivElement>, date: string, count: number) => {
    const wrap = wrapRef.current;
    if (!wrap) return;
    const cell = e.currentTarget.getBoundingClientRect();
    const base = wrap.getBoundingClientRect();
    const d = new Date(date + 'T00:00:00').toLocaleDateString('en-US', {
      month: 'short', day: 'numeric',
    });
    setTip({
      x: cell.left - base.left + cell.width / 2,
      y: cell.top - base.top,
      label: `${count === 0 ? 'No' : count} contribution${count === 1 ? '' : 's'}, ${d}`,
    });
  };

  // Month labels: record the first column index where each month starts
  const monthLabels: { label: string; col: number }[] = [];
  let lastMonth = '';
  weeks.forEach((week, i) => {
    const d = new Date(week.firstDay + 'T00:00:00');
    const m = d.toLocaleString('en-US', { month: 'short' });
    if (m !== lastMonth) {
      monthLabels.push({ label: m, col: i });
      lastMonth = m;
    }
  });

  const totalCols = weeks.length;

  return (
    <div className="w-full relative" ref={wrapRef}>
      {/* Cell tooltip */}
      {tip && (
        <div className="absolute z-10 pointer-events-none -translate-x-1/2 -translate-y-full
                        px-2.5 py-1.5 rounded-md border border-line-strong bg-panel-hi
                        font-mono text-[11px] text-ink whitespace-nowrap shadow-lg"
             style={{ left: tip.x, top: tip.y - 6 }}>
          {tip.label}
        </div>
      )}

      {/* Scrollable grid — scrolls horizontally on mobile */}
      <div className="overflow-x-auto pb-2 -mx-1 px-1" onMouseLeave={() => setTip(null)}>
        <div className="inline-flex gap-[3px]" style={{ minWidth: 'max-content' }}>

          {/* Day-of-week labels column */}
          <div className="flex flex-col gap-[3px] mr-1 pt-[15px]">
            {DAY_LABELS.map((label, i) => (
              <div
                key={label}
                className="w-6 h-[10px] text-right text-[8px] leading-[10px] text-fnt pr-1 select-none"
              >
                {DAY_LABEL_INDICES.has(i) ? label : ''}
              </div>
            ))}
          </div>

          {/* Weeks grid */}
          <div className="flex flex-col">
            {/* Month labels row — uses inline left: for computed column position */}
            <div className="relative h-[13px] mb-[2px]" style={{ width: totalCols * STEP }}>
              {monthLabels.map(({ label, col }) => (
                <span
                  key={`${label}-${col}`}
                  className="absolute text-[9px] font-mono text-fnt select-none leading-none"
                  style={{ left: col * STEP }}
                >
                  {label}
                </span>
              ))}
            </div>

            {/* Cell grid */}
            <div className="flex gap-[3px]">
              {weeks.map((week, wi) => (
                <div key={wi} className="flex flex-col gap-[3px] cal-col"
                     style={{ '--fxd': `${wi * 14}ms` } as React.CSSProperties}>
                  {/* Pad days if week starts mid-week (first week of year) */}
                  {week.days.length < 7 &&
                    Array.from({ length: 7 - week.days.length }).map((_, pi) => (
                      <div key={`pre-${pi}`} className="w-[10px] h-[10px]" />
                    ))
                  }
                  {week.days.map((day, di) => (
                    <div
                      key={di}
                      aria-label={`${day.date}: ${day.count} contribution${day.count !== 1 ? 's' : ''}`}
                      className="w-[10px] h-[10px] rounded-[2px] cursor-default flex-shrink-0
                                 transition-transform duration-150 hover:scale-125"
                      style={{ background: LEVEL_BG[day.level] }}
                      onMouseEnter={e => showTip(e, day.date, day.count)}
                    />
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center justify-between mt-3 flex-wrap gap-3">
        <div className="flex items-center gap-1.5">
          <span className="text-[9px] text-fnt mr-1 select-none">Less</span>
          {[0, 1, 2, 3, 4].map(level => (
            <div
              key={level}
              className="w-[10px] h-[10px] rounded-[2px] flex-shrink-0"
              style={{ background: LEVEL_BG[level] }}
            />
          ))}
          <span className="text-[9px] text-fnt ml-1 select-none">More</span>
        </div>
        <span className="text-[9px] font-mono text-fnt select-none">
          {new Date(dataset.generatedAt).getFullYear()} contribution activity
        </span>
      </div>

      {/* Stats row */}
      <div className="flex flex-wrap gap-x-6 gap-y-2 mt-4 pt-4 border-t border-line">
        <CalStat value={totalContributions.toLocaleString()} label="total contributions" accent />
        <CalStat value={totalCommits.toLocaleString()} label="commits" />
        <CalStat value={totalPRs.toLocaleString()} label="pull requests" />
        <CalStat value={`${longestStreak}d`} label="longest streak" />
        <CalStat value={`${currentStreak}d`} label="current streak" highlight={currentStreak > 0} />
      </div>
    </div>
  );
}

function CalStat({ value, label, accent, highlight }: {
  value: string;
  label: string;
  accent?: boolean;
  highlight?: boolean;
}) {
  return (
    <div className="flex items-baseline gap-1.5">
      <span className={`text-sm font-mono font-semibold tabular-nums ${
        accent ? 'text-signal' : highlight ? 'text-tel' : 'text-ink'
      }`}>
        {value}
      </span>
      <span className="text-xs text-fnt">{label}</span>
    </div>
  );
}
