import type { ActivityDataset } from '../hooks/useActivity';

// GitHub dark-mode contribution level colors
const LEVEL_BG: Record<number, string> = {
  0: 'rgba(255,255,255,0.05)',
  1: '#0e4429',
  2: '#006d32',
  3: '#26a641',
  4: '#39d353',
};

// Days shown as labels (Mon=1, Wed=3, Fri=5 in 0-indexed week)
const DAY_LABEL_INDICES = new Set([1, 3, 5]);
const DAY_LABELS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

interface Props {
  dataset: ActivityDataset;
}

export function ContributionCalendar({ dataset }: Props) {
  const { weeks, totalContributions, totalCommits, totalPRs, longestStreak, currentStreak } = dataset;

  // Build month labels: first week index where a new month starts
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

  // Each cell is 10px + 3px gap = 13px per column
  const CELL = 10;
  const GAP = 3;
  const STEP = CELL + GAP;

  const totalCols = weeks.length;

  return (
    <div className="w-full">
      {/* Scrollable grid area */}
      <div className="overflow-x-auto pb-1 -mx-1 px-1">
        <div className="inline-flex gap-[3px]" style={{ minWidth: 'max-content' }}>

          {/* Day-of-week labels */}
          <div className="flex flex-col gap-[3px] mr-1" style={{ paddingTop: `${CELL + GAP + 2}px` }}>
            {DAY_LABELS.map((label, i) => (
              <div
                key={label}
                style={{ width: 24, height: CELL, lineHeight: `${CELL}px` }}
                className="text-right text-[8px] text-slate-600 pr-1 select-none"
              >
                {DAY_LABEL_INDICES.has(i) ? label : ''}
              </div>
            ))}
          </div>

          {/* Weeks column */}
          <div className="flex flex-col">
            {/* Month labels row */}
            <div className="relative mb-[2px]" style={{ height: CELL + GAP, width: totalCols * STEP }}>
              {monthLabels.map(({ label, col }) => (
                <span
                  key={`${label}-${col}`}
                  className="absolute text-[9px] text-slate-500 select-none leading-none"
                  style={{ left: col * STEP, top: 0 }}
                >
                  {label}
                </span>
              ))}
            </div>

            {/* Cell grid */}
            <div className="flex gap-[3px]">
              {weeks.map((week, wi) => (
                <div key={wi} className="flex flex-col gap-[3px]">
                  {/* Pad days if week starts mid-week (first week of year) */}
                  {week.days.length < 7 &&
                    Array.from({ length: 7 - week.days.length }).map((_, pi) => (
                      <div key={`pre-${pi}`} style={{ width: CELL, height: CELL }} />
                    ))
                  }
                  {week.days.map((day, di) => (
                    <div
                      key={di}
                      title={`${day.date} — ${day.count} contribution${day.count !== 1 ? 's' : ''}`}
                      style={{
                        width: CELL,
                        height: CELL,
                        borderRadius: 2,
                        background: LEVEL_BG[day.level],
                        cursor: 'default',
                        flexShrink: 0,
                      }}
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
          <span className="text-[9px] text-slate-600 mr-1">Less</span>
          {[0, 1, 2, 3, 4].map(level => (
            <div
              key={level}
              style={{ width: CELL, height: CELL, borderRadius: 2, background: LEVEL_BG[level], flexShrink: 0 }}
            />
          ))}
          <span className="text-[9px] text-slate-600 ml-1">More</span>
        </div>
        <span className="text-[9px] text-slate-600">
          {new Date(dataset.generatedAt).getFullYear()} contribution activity
        </span>
      </div>

      {/* Stats row */}
      <div className="flex flex-wrap gap-x-6 gap-y-2 mt-4 pt-4 border-t border-white/[0.05]">
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
      <span className={`text-sm font-bold tabular-nums ${
        accent ? 'text-indigo-300' : highlight ? 'text-emerald-400' : 'text-slate-200'
      }`}>
        {value}
      </span>
      <span className="text-xs text-slate-600">{label}</span>
    </div>
  );
}
