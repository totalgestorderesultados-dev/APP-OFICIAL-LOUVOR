"use client";

import { useState, useEffect } from "react";
import { getMembers, addMember, updateMember, deleteMember } from "@/lib/store";
import { Member, Role } from "@/types";
import { Plus, Edit2, Trash2, X } from "lucide-react";

const ROLES: Role[] = [
  "Ministro",
  "Backvocal",
  "Violão",
  "Cajón",
  "Contrabaixo",
  "Mesa de som",
];

export default function MembersPage() {
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [memberToDelete, setMemberToDelete] = useState<string | null>(null);
  const [editingMember, setEditingMember] = useState<Member | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form State
  const [name, setName] = useState("");
  const [selectedRoles, setSelectedRoles] = useState<Role[]>([]);

  const fetchMembers = async () => {
    setLoading(true);
    const data = await getMembers();
    setMembers(data);
    setLoading(false);
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchMembers();
  }, []);

  const openModal = (member?: Member) => {
    if (member) {
      setEditingMember(member);
      setName(member.name);
      setSelectedRoles(member.roles);
    } else {
      setEditingMember(null);
      setName("");
      setSelectedRoles([]);
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingMember(null);
    setName("");
    setSelectedRoles([]);
  };

  const toggleRole = (role: Role) => {
    setSelectedRoles((prev) =>
      prev.includes(role) ? prev.filter((r) => r !== role) : [...prev, role],
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    setIsSaving(true);
    setError(null);

    try {
      if (editingMember) {
        await updateMember(editingMember.id, { name, roles: selectedRoles });
      } else {
        await addMember({ name, roles: selectedRoles });
      }
      closeModal();
      fetchMembers();
    } catch (err) {
      console.error("Error saving member:", err);
      setError("Erro ao salvar membro. Verifique se as tabelas existem no Supabase.");
    } finally {
      setIsSaving(false);
    }
  };

  const confirmDelete = (id: string) => {
    setMemberToDelete(id);
    setIsDeleteModalOpen(true);
  };

  const handleDelete = async () => {
    if (!memberToDelete) return;
    
    try {
      await deleteMember(memberToDelete);
      fetchMembers();
      setIsDeleteModalOpen(false);
      setMemberToDelete(null);
    } catch (err) {
      console.error("Error deleting member:", err);
      alert("Erro ao excluir membro.");
    }
  };

  if (loading)
    return (
      <div className="flex justify-center items-center h-full">
        Carregando membros...
      </div>
    );

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-[#0f0f0f] tracking-tight">
            Membros
          </h1>
          <p className="text-gray-500 mt-1">
            Gerencie os integrantes do ministério
          </p>
        </div>
        <button
          onClick={() => openModal()}
          className="bg-[#0a1f44] text-white px-5 py-2.5 rounded-xl font-medium flex items-center hover:bg-[#0a1f44]/90 transition-colors shadow-sm"
        >
          <Plus size={20} className="mr-2" />
          Adicionar Membro
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/50 border-b border-gray-100 text-gray-500 text-sm font-medium">
                <th className="p-4 pl-6">Nome</th>
                <th className="p-4">Funções</th>
                <th className="p-4 pr-6 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {members.length === 0 ? (
                <tr>
                  <td colSpan={3} className="p-8 text-center text-gray-400">
                    Nenhum membro cadastrado.
                  </td>
                </tr>
              ) : (
                members.map((member) => (
                  <tr
                    key={member.id}
                    className="hover:bg-gray-50/50 transition-colors"
                  >
                    <td className="p-4 pl-6 font-medium text-[#0f0f0f]">
                      {member.name}
                    </td>
                    <td className="p-4">
                      <div className="flex flex-wrap gap-2">
                        {member.roles.map((role) => (
                          <span
                            key={role}
                            className="bg-blue-50 text-blue-700 px-2.5 py-1 rounded-md text-xs font-medium border border-blue-100"
                          >
                            {role}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="p-4 pr-6 text-right">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => openModal(member)}
                          className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        >
                          <Edit2 size={18} />
                        </button>
                        <button
                          onClick={() => confirmDelete(member.id)}
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
                {editingMember ? "Editar Membro" : "Novo Membro"}
              </h2>
              <button
                onClick={closeModal}
                className="text-gray-400 hover:text-gray-600 p-1 rounded-md hover:bg-gray-100 transition-colors"
              >
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              {error && (
                <div className="bg-red-50 text-red-600 p-3 rounded-xl text-sm border border-red-100">
                  {error}
                </div>
              )}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nome Completo
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#0a1f44]/20 focus:border-[#0a1f44] transition-all"
                  placeholder="Ex: João Silva"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Funções
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {ROLES.map((role) => (
                    <label
                      key={role}
                      className={`flex items-center p-3 rounded-xl border cursor-pointer transition-all ${
                        selectedRoles.includes(role)
                          ? "border-[#0a1f44] bg-blue-50/50"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={selectedRoles.includes(role)}
                        onChange={() => toggleRole(role)}
                        className="w-4 h-4 text-[#0a1f44] rounded border-gray-300 focus:ring-[#0a1f44]"
                      />
                      <span className="ml-3 text-sm font-medium text-gray-700">
                        {role}
                      </span>
                    </label>
                  ))}
                </div>
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
            <h3 className="text-xl font-bold text-[#0f0f0f] mb-2">Excluir Membro</h3>
            <p className="text-gray-500 mb-6">
              Tem certeza que deseja excluir este membro? Esta ação não pode ser desfeita.
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
