import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Cell,
  LabelList,
} from "recharts";

interface ChartStatProps {
  distribution: Record<string, number>;
  userTries: number;
}

export function ChartStat({ distribution, userTries }: ChartStatProps) {
  const chartData = [];
  let eightPlusCount = 0;

  for (let i = 1; i <= 7; i++) {
    chartData.push({
      name: i.toString(),
      count: distribution[i.toString()] || 0,
      isUser: userTries === i,
    });
  }

  Object.entries(distribution).forEach(([key, value]) => {
    if (parseInt(key) >= 8) {
      eightPlusCount += value;
    }
  });

  chartData.push({
    name: "8+",
    count: eightPlusCount,
    isUser: userTries >= 8,
  });

  return (
    <div className="w-full h-64 mt-2">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={chartData}
          layout="vertical"
          margin={{ top: 0, right: 35, left: -15, bottom: 0 }}
        >
          <XAxis type="number" hide />

          <YAxis
            dataKey="name"
            type="category"
            axisLine={false}
            tickLine={false}
            tick={{
              fill: "#9ca3af",
              fontSize: 13,
              fontWeight: "bold",
              fontFamily:
                "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace",
            }}
            width={40}
          />

          <Bar
            dataKey="count"
            radius={[0, 0, 0, 0]} 
            minPointSize={4} 
            barSize={18} 
            activeBar={false}
            isAnimationActive={false}
          >
            {chartData.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={entry.isUser ? "#2ed1b4" : "#2a2a2a"} 
              />
            ))}
            <LabelList
              dataKey="count"
              position="right"
              fill="#9ca3af"
              fontSize={12}
              fontWeight="bold"
              fontFamily="ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace"
            />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
