"use client";

import { useState, useEffect } from "react";
import { getSongs, addSong, updateSong, deleteSong } from "@/lib/store";
import { Song, SongCategory } from "@/types";
import { Plus, Edit2, Trash2, X, ExternalLink } from "lucide-react";

const CATEGORIES: SongCategory[] = ["Celebração", "Exaltação", "Adoração"];

export default function SongsPage() {
  const [songs, setSongs] = useState<Song[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [songToDelete, setSongToDelete] = useState<string | null>(null);
  const [editingSong, setEditingSong] = useState<Song | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form State
  const [name, setName] = useState("");
  const [artist, setArtist] = useState("");
  const [category, setCategory] = useState<SongCategory>("Celebração");
  const [link, setLink] = useState("");

  const fetchSongs = async () => {
    setLoading(true);
    const data = await getSongs();
    setSongs(data);
    setLoading(false);
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchSongs();
  }, []);

  const openModal = (song?: Song) => {
    if (song) {
      setEditingSong(song);
      setName(song.name);
      setArtist(song.artist);
      setCategory(song.category);
      setLink(song.link || "");
    } else {
      setEditingSong(null);
      setName("");
      setArtist("");
      setCategory("Celebração");
      setLink("");
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingSong(null);
    setName("");
    setArtist("");
    setCategory("Celebração");
    setLink("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !artist.trim()) return;

    setIsSaving(true);
    setError(null);

    const songData = { name, artist, category, link };

    try {
      if (editingSong) {
        await updateSong(editingSong.id, songData);
      } else {
        await addSong(songData);
      }
      closeModal();
      fetchSongs();
    } catch (err) {
      console.error("Error saving song:", err);
      setError("Erro ao salvar música. Verifique se as tabelas existem no Supabase.");
    } finally {
      setIsSaving(false);
    }
  };

  const confirmDelete = (id: string) => {
    setSongToDelete(id);
    setIsDeleteModalOpen(true);
  };

  const handleDelete = async () => {
    if (!songToDelete) return;
    
    try {
      await deleteSong(songToDelete);
      fetchSongs();
      setIsDeleteModalOpen(false);
      setSongToDelete(null);
    } catch (err) {
      console.error("Error deleting song:", err);
      alert("Erro ao excluir música.");
    }
  };

  if (loading)
    return (
      <div className="flex justify-center items-center h-full">
        Carregando músicas...
      </div>
    );

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-[#0f0f0f] tracking-tight">
            Músicas
          </h1>
          <p className="text-gray-500 mt-1">
            Repertório do ministério de louvor
          </p>
        </div>
        <button
          onClick={() => openModal()}
          className="bg-[#0a1f44] text-white px-5 py-2.5 rounded-xl font-medium flex items-center hover:bg-[#0a1f44]/90 transition-colors shadow-sm"
        >
          <Plus size={20} className="mr-2" />
          Adicionar Música
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/50 border-b border-gray-100 text-gray-500 text-sm font-medium">
                <th className="p-4 pl-6">Música</th>
                <th className="p-4">Artista/Banda</th>
                <th className="p-4">Categoria</th>
                <th className="p-4">Link</th>
                <th className="p-4 pr-6 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {songs.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-gray-400">
                    Nenhuma música cadastrada.
                  </td>
                </tr>
              ) : (
                songs.map((song) => (
                  <tr
                    key={song.id}
                    className="hover:bg-gray-50/50 transition-colors"
                  >
                    <td className="p-4 pl-6 font-medium text-[#0f0f0f]">
                      {song.name}
                    </td>
                    <td className="p-4 text-gray-600">{song.artist}</td>
                    <td className="p-4">
                      <span
                        className={`px-2.5 py-1 rounded-md text-xs font-medium border ${
                          song.category === "Celebração"
                            ? "bg-orange-50 text-orange-700 border-orange-100"
                            : song.category === "Exaltação"
                              ? "bg-blue-50 text-blue-700 border-blue-100"
                              : "bg-purple-50 text-purple-700 border-purple-100"
                        }`}
                      >
                        {song.category}
                      </span>
                    </td>
                    <td className="p-4">
                      {song.link ? (
                        <a
                          href={song.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-800 flex items-center gap-1 text-sm font-medium"
                        >
                          <ExternalLink size={14} /> Ouvir
                        </a>
                      ) : (
                        <span className="text-gray-400 text-sm">-</span>
                      )}
                    </td>
                    <td className="p-4 pr-6 text-right">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => openModal(song)}
                          className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        >
                          <Edit2 size={18} />
                        </button>
                        <button
                          onClick={() => confirmDelete(song.id)}
                          className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden">
            <div className="flex justify-between items-center p-6 border-b border-gray-100">
              <h2 className="text-xl font-bold text-[#0f0f0f]">
                {editingSong ? "Editar Música" : "Nova Música"}
              </h2>
              <button
                onClick={closeModal}
                className="text-gray-400 hover:text-gray-600 p-1 rounded-md hover:bg-gray-100 transition-colors"
              >
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-5">
              {error && (
                <div className="bg-red-50 text-red-600 p-3 rounded-xl text-sm border border-red-100">
                  {error}
                </div>
              )}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nome da Música
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#0a1f44]/20 focus:border-[#0a1f44] transition-all"
                  placeholder="Ex: Lindo És"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Artista / Banda
                </label>
                <input
                  type="text"
                  value={artist}
                  onChange={(e) => setArtist(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#0a1f44]/20 focus:border-[#0a1f44] transition-all"
                  placeholder="Ex: Livres para Adorar"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Categoria
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as SongCategory)}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#0a1f44]/20 focus:border-[#0a1f44] transition-all bg-white"
                >
                  {CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Link (YouTube/Spotify){" "}
                  <span className="text-gray-400 font-normal">(Opcional)</span>
                </label>
                <input
                  type="url"
                  value={link}
                  onChange={(e) => setLink(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#0a1f44]/20 focus:border-[#0a1f44] transition-all"
                  placeholder="https://..."
                />
              </div>
              <div className="pt-4 flex justify-end gap-3">
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
                  {isSaving ? "Salvando..." : "Salvar"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm overflow-hidden p-6 text-center">
            <div className="w-16 h-16 bg-red-50 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <Trash2 size={32} />
            </div>
            <h3 className="text-xl font-bold text-[#0f0f0f] mb-2">Excluir Música</h3>
            <p className="text-gray-500 mb-6">
              Tem certeza que deseja excluir esta música? Esta ação não pode ser desfeita.
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
