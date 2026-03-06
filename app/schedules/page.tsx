"use client";

import { useState, useEffect } from "react";
import {
  getSchedules,
  addSchedule,
  updateSchedule,
  deleteSchedule,
  getMembers,
  getSongs,
} from "@/lib/store";
import { Schedule, Member, Song } from "@/types";
import {
  Plus,
  Edit2,
  Trash2,
  X,
  Calendar as CalendarIcon,
  Clock,
  Music,
  Users,
  ExternalLink,
} from "lucide-react";
import { format, parseISO } from "date-fns";
import { ptBR } from "date-fns/locale";

export default function SchedulesPage() {
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [members, setMembers] = useState<Member[]>([]);
  const [songs, setSongs] = useState<Song[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [scheduleToDelete, setScheduleToDelete] = useState<string | null>(null);
  const [editingSchedule, setEditingSchedule] = useState<Schedule | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form State
  const [date, setDate] = useState("");
  const [eventName, setEventName] = useState("");
  const [eventType, setEventType] = useState("Culto de Domingo");
  const [minister, setMinister] = useState("");
  const [backvocals, setBackvocals] = useState<string[]>([]);
  const [guitar, setGuitar] = useState("");
  const [cajon, setCajon] = useState("");
  const [bass, setBass] = useState("");
  const [soundDesk, setSoundDesk] = useState("");
  const [selectedSongs, setSelectedSongs] = useState<string[]>([]);
  const [songSearchTerm, setSongSearchTerm] = useState("");

  const fetchData = async () => {
    setLoading(true);
    const [scData, mData, sData] = await Promise.all([
      getSchedules(),
      getMembers(),
      getSongs(),
    ]);
    // Sort schedules by date descending
    setSchedules(
      scData.sort(
        (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
      ),
    );
    setMembers(mData);
    setSongs(sData);
    setLoading(false);
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchData();
  }, []);

  const openModal = (schedule?: Schedule) => {
    if (schedule) {
      setEditingSchedule(schedule);
      setDate(schedule.date);
      setEventName(schedule.eventName || "");
      setEventType(schedule.eventType);
      setMinister(schedule.minister);
      setBackvocals(schedule.backvocals);
      setGuitar(schedule.guitar);
      setCajon(schedule.cajon);
      setBass(schedule.bass);
      setSoundDesk(schedule.soundDesk);
      setSelectedSongs(schedule.songs);
    } else {
      setEditingSchedule(null);
      setDate(new Date().toISOString().split("T")[0]);
      setEventName("");
      setEventType("Culto de Domingo");
      setMinister("");
      setBackvocals([]);
      setGuitar("");
      setCajon("");
      setBass("");
      setSoundDesk("");
      setSelectedSongs([]);
    }
    setSongSearchTerm("");
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingSchedule(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!date || !eventName) return;

    setIsSaving(true);
    setError(null);

    const scheduleData = {
      date,
      eventName,
      eventType: eventName, // Use eventName for both for consistency if eventType is hidden
      minister,
      backvocals,
      guitar,
      cajon,
      bass,
      soundDesk,
      songs: selectedSongs,
    };

    try {
      if (editingSchedule) {
        await updateSchedule(editingSchedule.id, scheduleData);
      } else {
        await addSchedule(scheduleData);
      }
      closeModal();
      fetchData();
    } catch (err) {
      console.error("Error saving schedule:", err);
      setError("Erro ao salvar escala. Verifique se as tabelas existem no Supabase.");
    } finally {
      setIsSaving(false);
    }
  };

  const confirmDelete = (id: string) => {
    setScheduleToDelete(id);
    setIsDeleteModalOpen(true);
  };

  const handleDelete = async () => {
    if (!scheduleToDelete) return;
    
    try {
      await deleteSchedule(scheduleToDelete);
      fetchData();
      setIsDeleteModalOpen(false);
      setScheduleToDelete(null);
    } catch (err) {
      console.error("Error deleting schedule:", err);
      alert("Erro ao excluir escala.");
    }
  };

  const getMemberName = (id: string) =>
    members.find((m) => m.id === id)?.name || "-";
  const getSong = (id: string) =>
    songs.find((s) => s.id === id);
  const getSongName = (id: string) =>
    getSong(id)?.name || "Música excluída";

  const copyToClipboard = (schedule: Schedule) => {
    const dateStr = format(parseISO(schedule.date), "EEEE, dd/MM", {
      locale: ptBR,
    });
    
    let text = `*ESCALA DE LOUVOR*\n`;
    text += `*Evento:* ${schedule.eventType}${schedule.eventName ? ` - ${schedule.eventName}` : ""}\n`;
    text += `*Data:* ${dateStr}\n\n`;
    
    text += `*EQUIPE:*\n`;
    text += `🎤 Ministro: ${getMemberName(schedule.minister)}\n`;
    if (schedule.backvocals.length > 0) {
      text += `🎤 Backvocals: ${schedule.backvocals.map(id => getMemberName(id)).join(", ")}\n`;
    }
    text += `🎸 Violão: ${getMemberName(schedule.guitar)}\n`;
    text += `🥁 Cajón: ${getMemberName(schedule.cajon)}\n`;
    text += `🎸 Baixo: ${getMemberName(schedule.bass)}\n`;
    text += `🎚️ Som: ${getMemberName(schedule.soundDesk)}\n\n`;
    
    if (schedule.songs.length > 0) {
      text += `*REPERTÓRIO:*\n`;
      schedule.songs.forEach((songId, idx) => {
        const song = getSong(songId);
        text += `${idx + 1}. ${song?.name || "Música excluída"}${song?.link ? ` (${song.link})` : ""}\n`;
      });
    }
    
    navigator.clipboard.writeText(text);
    alert("Escala copiada para o clipboard! Agora é só colar no WhatsApp.");
  };

  // Filters for dropdowns
  const ministers = members.filter((m) => m.roles.includes("Ministro"));
  const backvocalList = members.filter((m) => m.roles.includes("Backvocal"));
  const guitars = members.filter((m) => m.roles.includes("Violão"));
  const cajons = members.filter((m) => m.roles.includes("Cajón"));
  const basses = members.filter((m) => m.roles.includes("Contrabaixo"));
  const soundDesks = members.filter((m) => m.roles.includes("Mesa de som"));

  const CopyIcon = ({ size = 18 }: { size?: number }) => (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      width={size} 
      height={size} 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    >
      <rect width="14" height="14" x="8" y="8" rx="2" ry="2"/>
      <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/>
    </svg>
  );

  if (loading)
    return (
      <div className="flex justify-center items-center h-full">
        Carregando escalas...
      </div>
    );

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-[#0f0f0f] tracking-tight">
            Escalas
          </h1>
          <p className="text-gray-500 mt-1">
            Organize as equipes para os eventos
          </p>
        </div>
      </div>

      {/* ÁREA DE ADICIONAR ESCALAS (FIXA NO TOPO) */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border-2 border-[#0a1f44] animate-in slide-in-from-top duration-500">
        <div className="flex items-center gap-2 mb-6 pb-2 border-b border-gray-100">
          <div className="bg-[#0a1f44] p-2 rounded-lg text-white">
            <Plus size={20} />
          </div>
          <h2 className="text-xl font-black text-[#0a1f44] uppercase tracking-tight">
            Nova Escala de Louvor
          </h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end">
          <div className="space-y-2">
            <label className="block text-sm font-bold text-gray-700 uppercase">
              📅 Data da Escala
            </label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-[#0a1f44] focus:ring-0 transition-all font-bold text-lg"
            />
          </div>
          <div className="space-y-2">
            <label className="block text-sm font-bold text-gray-700 uppercase">
              📝 Nome do Evento
            </label>
            <input
              type="text"
              value={eventName}
              onChange={(e) => setEventName(e.target.value)}
              placeholder="Ex: Culto de Domingo"
              className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-[#0a1f44] focus:ring-0 transition-all font-bold text-lg"
            />
          </div>
          <button
            onClick={() => {
              if (!date || !eventName) {
                alert("Por favor, preencha a data e o nome do evento!");
                return;
              }
              setIsModalOpen(true);
            }}
            className="bg-[#0a1f44] text-white px-6 py-4 rounded-xl font-black uppercase tracking-widest hover:bg-[#0a1f44]/90 transition-all shadow-md active:scale-95 flex items-center justify-center gap-2"
          >
            Configurar Equipe <Plus size={20} />
          </button>
        </div>
        <p className="text-[10px] text-gray-400 mt-4 italic">
          * Preencha a data e o nome acima e clique em &quot;Configurar Equipe&quot; para escolher os músicos e músicas.
        </p>
      </div>

      {schedules.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 text-center">
          <CalendarIcon size={48} className="mx-auto text-gray-300 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-1">
            Nenhuma escala cadastrada
          </h3>
          <p className="text-gray-500 mb-6">
            Comece criando a primeira escala de louvor.
          </p>
          <button
            onClick={() => openModal()}
            className="text-[#0a1f44] font-medium hover:underline"
          >
            Criar primeira escala
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          {schedules.map((schedule) => (
            <div
              key={schedule.id}
              className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow"
            >
              <div className="p-6 border-b border-gray-50 flex justify-between items-start bg-gray-50/30">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded-full">
                      {schedule.eventName || "Escala de Louvor"}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-[#0f0f0f] flex items-center mt-2">
                    <CalendarIcon size={20} className="mr-2 text-gray-400" />
                    {format(parseISO(schedule.date), "EEEE, dd 'de' MMMM", {
                      locale: ptBR,
                    })}
                  </h3>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => copyToClipboard(schedule)}
                    title="Copiar para WhatsApp"
                    className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                  >
                    <CopyIcon />
                  </button>
                  <button
                    onClick={() => openModal(schedule)}
                    className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                  >
                    <Edit2 size={18} />
                  </button>
                  <button
                    onClick={() => confirmDelete(schedule.id)}
                    className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>

              <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h4 className="text-sm font-semibold text-gray-400 uppercase tracking-wider flex items-center">
                    <Users size={16} className="mr-2" /> Equipe
                  </h4>
                  <ul className="space-y-3">
                    <li className="flex justify-between items-center text-sm">
                      <span className="text-gray-500">Ministro:</span>
                      <span className="font-medium text-[#0f0f0f]">
                        {getMemberName(schedule.minister)}
                      </span>
                    </li>
                    <li className="flex justify-between items-start text-sm">
                      <span className="text-gray-500 mt-0.5">Backvocal:</span>
                      <div className="text-right">
                        {schedule.backvocals.length > 0 ? (
                          schedule.backvocals.map((id) => (
                            <div
                              key={id}
                              className="font-medium text-[#0f0f0f]"
                            >
                              {getMemberName(id)}
                            </div>
                          ))
                        ) : (
                          <span className="font-medium text-gray-400">-</span>
                        )}
                      </div>
                    </li>
                    <li className="flex justify-between items-center text-sm">
                      <span className="text-gray-500">Violão:</span>
                      <span className="font-medium text-[#0f0f0f]">
                        {getMemberName(schedule.guitar)}
                      </span>
                    </li>
                    <li className="flex justify-between items-center text-sm">
                      <span className="text-gray-500">Cajón:</span>
                      <span className="font-medium text-[#0f0f0f]">
                        {getMemberName(schedule.cajon)}
                      </span>
                    </li>
                    <li className="flex justify-between items-center text-sm">
                      <span className="text-gray-500">Contrabaixo:</span>
                      <span className="font-medium text-[#0f0f0f]">
                        {getMemberName(schedule.bass)}
                      </span>
                    </li>
                    <li className="flex justify-between items-center text-sm">
                      <span className="text-gray-500">Mesa de Som:</span>
                      <span className="font-medium text-[#0f0f0f]">
                        {getMemberName(schedule.soundDesk)}
                      </span>
                    </li>
                  </ul>
                </div>

                <div className="space-y-4">
                  <h4 className="text-sm font-semibold text-gray-400 uppercase tracking-wider flex items-center">
                    <Music size={16} className="mr-2" /> Repertório
                  </h4>
                  {schedule.songs.length > 0 ? (
                    <ul className="space-y-2">
                      {schedule.songs.map((songId, idx) => {
                        const song = getSong(songId);
                        return (
                          <li key={songId} className="text-sm flex items-center justify-between group">
                            <div className="flex items-start">
                              <span className="text-gray-400 w-5 font-mono text-xs mt-0.5">
                                {idx + 1}.
                              </span>
                              <span className="font-medium text-[#0f0f0f]">
                                {song?.name || "Música excluída"}
                              </span>
                            </div>
                            {song?.link && (
                              <a
                                href={song.link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-500 hover:text-blue-700 p-1 rounded-md hover:bg-blue-50 transition-colors"
                                title="Ouvir música"
                              >
                                <ExternalLink size={14} />
                              </a>
                            )}
                          </li>
                        );
                      })}
                    </ul>
                  ) : (
                    <p className="text-sm text-gray-400 italic">
                      Nenhuma música selecionada
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl my-8 animate-in fade-in zoom-in-95 duration-200 relative">
            <button
              onClick={closeModal}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 p-2 rounded-full hover:bg-gray-100 transition-colors z-20"
            >
              <X size={24} />
            </button>

            <form onSubmit={handleSubmit} className="p-6 space-y-8 pt-4">
              <div className="bg-gray-50 p-4 rounded-2xl border-2 border-dashed border-gray-200">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Data Selecionada</label>
                    <div className="text-lg font-bold text-[#0a1f44]">{date ? format(parseISO(date), "dd/MM/yyyy") : "-"}</div>
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Evento</label>
                    <div className="text-lg font-bold text-[#0a1f44]">{eventName || "-"}</div>
                  </div>
                </div>
              </div>

              {error && (
                <div className="bg-red-50 text-red-600 p-3 rounded-xl text-sm border border-red-100">
                  {error}
                </div>
              )}

              {/* Team */}
              <div>
                <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4 border-b pb-2">
                  Equipe
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Ministro
                    </label>
                    <select
                      value={minister}
                      onChange={(e) => setMinister(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#0a1f44]/20 focus:border-[#0a1f44] transition-all bg-white"
                    >
                      <option value="">Selecione...</option>
                      {ministers.map((m) => (
                        <option key={m.id} value={m.id}>
                          {m.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Backvocal (Múltiplos)
                    </label>
                    <div className="max-h-32 overflow-y-auto border border-gray-200 rounded-xl p-2 bg-gray-50/50">
                      {backvocalList.length === 0 ? (
                        <p className="text-sm text-gray-400 p-2">
                          Nenhum backvocal cadastrado.
                        </p>
                      ) : (
                        backvocalList.map((m) => (
                          <label
                            key={m.id}
                            className="flex items-center p-2 hover:bg-white rounded-lg cursor-pointer transition-colors"
                          >
                            <input
                              type="checkbox"
                              checked={backvocals.includes(m.id)}
                              onChange={(e) => {
                                if (e.target.checked)
                                  setBackvocals([...backvocals, m.id]);
                                else
                                  setBackvocals(
                                    backvocals.filter((id) => id !== m.id),
                                  );
                              }}
                              className="w-4 h-4 text-[#0a1f44] rounded border-gray-300 focus:ring-[#0a1f44]"
                            />
                            <span className="ml-3 text-sm text-gray-700">
                              {m.name}
                            </span>
                          </label>
                        ))
                      )}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Violão
                    </label>
                    <select
                      value={guitar}
                      onChange={(e) => setGuitar(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#0a1f44]/20 focus:border-[#0a1f44] transition-all bg-white"
                    >
                      <option value="">Selecione...</option>
                      {guitars.map((m) => (
                        <option key={m.id} value={m.id}>
                          {m.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Cajón
                    </label>
                    <select
                      value={cajon}
                      onChange={(e) => setCajon(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#0a1f44]/20 focus:border-[#0a1f44] transition-all bg-white"
                    >
                      <option value="">Selecione...</option>
                      {cajons.map((m) => (
                        <option key={m.id} value={m.id}>
                          {m.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Contrabaixo
                    </label>
                    <select
                      value={bass}
                      onChange={(e) => setBass(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#0a1f44]/20 focus:border-[#0a1f44] transition-all bg-white"
                    >
                      <option value="">Selecione...</option>
                      {basses.map((m) => (
                        <option key={m.id} value={m.id}>
                          {m.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Mesa de Som
                    </label>
                    <select
                      value={soundDesk}
                      onChange={(e) => setSoundDesk(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#0a1f44]/20 focus:border-[#0a1f44] transition-all bg-white"
                    >
                      <option value="">Selecione...</option>
                      {soundDesks.map((m) => (
                        <option key={m.id} value={m.id}>
                          {m.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Repertoire */}
              <div>
                <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4 border-b pb-2">
                  Repertório
                </h3>
                <div className="mb-4">
                  <input
                    type="text"
                    placeholder="Buscar música pelo nome..."
                    value={songSearchTerm}
                    onChange={(e) => setSongSearchTerm(e.target.value)}
                    className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#0a1f44]/20 focus:border-[#0a1f44] transition-all text-sm"
                  />
                </div>
                <div className="max-h-48 overflow-y-auto border border-gray-200 rounded-xl p-2 bg-gray-50/50">
                  {songs.length === 0 ? (
                    <p className="text-sm text-gray-400 p-2">
                      Nenhuma música cadastrada.
                    </p>
                  ) : (
                    songs
                      .filter((song) =>
                        song.name
                          .toLowerCase()
                          .includes(songSearchTerm.toLowerCase()),
                      )
                      .map((song) => (
                      <label
                        key={song.id}
                        className="flex items-center p-2 hover:bg-white rounded-lg cursor-pointer transition-colors"
                      >
                        <input
                          type="checkbox"
                          checked={selectedSongs.includes(song.id)}
                          onChange={(e) => {
                            if (e.target.checked)
                              setSelectedSongs([...selectedSongs, song.id]);
                            else
                              setSelectedSongs(
                                selectedSongs.filter((id) => id !== song.id),
                              );
                          }}
                          className="w-4 h-4 text-[#0a1f44] rounded border-gray-300 focus:ring-[#0a1f44]"
                        />
                        <div className="ml-3 flex flex-col">
                          <span className="text-sm font-medium text-gray-900">
                            {song.name}
                          </span>
                          <span className="text-xs text-gray-500">
                            {song.artist} • {song.category}
                          </span>
                        </div>
                      </label>
                    ))
                  )}
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  Selecione as músicas que serão tocadas neste evento.
                </p>
              </div>

              <div className="pt-4 flex justify-end gap-3 sticky bottom-0 bg-white py-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-5 py-2.5 rounded-xl text-gray-600 font-medium hover:bg-gray-100 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="bg-[#0a1f44] text-white px-6 py-2.5 rounded-xl font-medium hover:bg-[#0a1f44]/90 transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSaving ? "Salvando..." : "Salvar Escala"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <div className="text-center py-4 text-[10px] text-gray-300">
        Versão 1.0.5 - Atualizado em 06/03
      </div>
      {isDeleteModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm overflow-hidden p-6 text-center">
            <div className="w-16 h-16 bg-red-50 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <Trash2 size={32} />
            </div>
            <h3 className="text-xl font-bold text-[#0f0f0f] mb-2">Excluir Escala</h3>
            <p className="text-gray-500 mb-6">
              Tem certeza que deseja excluir esta escala? Esta ação não pode ser desfeita.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setIsDeleteModalOpen(false)}
                className="flex-1 px-4 py-2.5 rounded-xl text-gray-600 font-medium hover:bg-gray-100 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={handleDelete}
                className="flex-1 bg-red-600 text-white px-4 py-2.5 rounded-xl font-medium hover:bg-red-700 transition-colors shadow-sm"
              >
                Excluir
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
