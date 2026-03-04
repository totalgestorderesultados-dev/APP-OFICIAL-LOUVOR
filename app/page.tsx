"use client";

import { useEffect, useState } from "react";
import { getMembers, getSongs, getSchedules } from "@/lib/store";
import { Member, Song, Schedule } from "@/types";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { Users, Music, CalendarDays, TrendingUp } from "lucide-react";

export default function Dashboard() {
  const [members, setMembers] = useState<Member[]>([]);
  const [songs, setSongs] = useState<Song[]>([]);
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const [m, s, sc] = await Promise.all([
        getMembers(),
        getSongs(),
        getSchedules(),
      ]);
      setMembers(m);
      setSongs(s);
      setSchedules(sc);
      setLoading(false);
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-full">
        Carregando dashboard...
      </div>
    );
  }

  // Analytics Calculations
  const memberParticipations = members
    .map((m) => {
      let count = 0;
      schedules.forEach((s) => {
        if (s.minister === m.id) count++;
        if (s.backvocals.includes(m.id)) count++;
        if (s.guitar === m.id) count++;
        if (s.cajon === m.id) count++;
        if (s.bass === m.id) count++;
        if (s.soundDesk === m.id) count++;
      });
      return { name: m.name, participations: count };
    })
    .sort((a, b) => b.participations - a.participations)
    .slice(0, 5);

  const roleCounts = {
    Ministro: 0,
    Backvocal: 0,
    Violão: 0,
    Cajón: 0,
    Contrabaixo: 0,
    "Mesa de som": 0,
  };
  schedules.forEach((s) => {
    if (s.minister) roleCounts.Ministro++;
    if (s.backvocals.length) roleCounts.Backvocal += s.backvocals.length;
    if (s.guitar) roleCounts.Violão++;
    if (s.cajon) roleCounts.Cajón++;
    if (s.bass) roleCounts.Contrabaixo++;
    if (s.soundDesk) roleCounts["Mesa de som"]++;
  });
  const roleData = Object.entries(roleCounts).map(([name, value]) => ({
    name,
    value,
  }));

  const songCounts: Record<string, number> = {};
  schedules.forEach((s) => {
    s.songs.forEach((songId) => {
      songCounts[songId] = (songCounts[songId] || 0) + 1;
    });
  });

  const topSongs = Object.entries(songCounts)
    .map(([id, count]) => {
      const song = songs.find((s) => s.id === id);
      return { name: song?.name || "Desconhecida", count };
    })
    .sort((a, b) => b.count - a.count)
    .slice(0, 6);

  const COLORS = [
    "#0a1f44",
    "#1e3a8a",
    "#3b82f6",
    "#60a5fa",
    "#93c5fd",
    "#bfdbfe",
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div>
        <h1 className="text-3xl font-bold text-[#0f0f0f] tracking-tight">
          Dashboard
        </h1>
        <p className="text-gray-500 mt-1">
          Visão geral do ministério de louvor
        </p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total de Escalas"
          value={schedules.length}
          icon={CalendarDays}
        />
        <StatCard title="Membros Ativos" value={members.length} icon={Users} />
        <StatCard
          title="Músicas Cadastradas"
          value={songs.length}
          icon={Music}
        />
        <StatCard
          title="Média Músicas/Escala"
          value={
            schedules.length
              ? Math.round(
                  schedules.reduce((acc, s) => acc + s.songs.length, 0) /
                    schedules.length,
                )
              : 0
          }
          icon={TrendingUp}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Top Members Chart */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h2 className="text-lg font-semibold mb-6 text-[#0f0f0f]">
            Membros mais escalados
          </h2>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={memberParticipations}
                layout="vertical"
                margin={{ top: 5, right: 30, left: 40, bottom: 5 }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  horizontal={false}
                  stroke="#f0f0f0"
                />
                <XAxis type="number" />
                <YAxis
                  dataKey="name"
                  type="category"
                  width={100}
                  tick={{ fontSize: 12 }}
                />
                <Tooltip
                  cursor={{ fill: "#f8f9fa" }}
                  contentStyle={{
                    borderRadius: "8px",
                    border: "none",
                    boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                  }}
                />
                <Bar
                  dataKey="participations"
                  fill="#0a1f44"
                  radius={[0, 4, 4, 0]}
                  barSize={24}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Roles Distribution */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h2 className="text-lg font-semibold mb-6 text-[#0f0f0f]">
            Distribuição por Funções
          </h2>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={roleData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {roleData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    borderRadius: "8px",
                    border: "none",
                    boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex flex-wrap justify-center gap-4 mt-4">
            {roleData.map((entry, index) => (
              <div
                key={entry.name}
                className="flex items-center text-xs text-gray-600"
              >
                <div
                  className="w-3 h-3 rounded-full mr-2"
                  style={{ backgroundColor: COLORS[index % COLORS.length] }}
                />
                {entry.name} ({entry.value})
              </div>
            ))}
          </div>
        </div>

        {/* Top Songs */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 lg:col-span-2">
          <h2 className="text-lg font-semibold mb-6 text-[#0f0f0f]">
            Top 6 Músicas Mais Tocadas
          </h2>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={topSongs}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="#f0f0f0"
                />
                <XAxis
                  dataKey="name"
                  tick={{ fontSize: 12 }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis axisLine={false} tickLine={false} />
                <Tooltip
                  cursor={{ fill: "#f8f9fa" }}
                  contentStyle={{
                    borderRadius: "8px",
                    border: "none",
                    boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                  }}
                />
                <Bar
                  dataKey="count"
                  fill="#3b82f6"
                  radius={[4, 4, 0, 0]}
                  barSize={40}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({
  title,
  value,
  icon: Icon,
}: {
  title: string;
  value: number;
  icon: any;
}) {
  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center">
      <div className="p-4 bg-blue-50 text-blue-600 rounded-xl mr-4">
        <Icon size={24} />
      </div>
      <div>
        <p className="text-sm font-medium text-gray-500">{title}</p>
        <p className="text-2xl font-bold text-[#0f0f0f]">{value}</p>
      </div>
    </div>
  );
}
