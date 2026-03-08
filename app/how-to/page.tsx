"use client";

import { HelpCircle, PlayCircle } from "lucide-react";

export default function HowToPage() {
  const tutorials = [
    {
      title: "Como editar escalas?",
      url: "https://www.youtube.com/embed/z1XUT5PBTss",
      originalUrl: "https://youtube.com/shorts/z1XUT5PBTss?feature=share",
    },
    {
      title: "Como adicionar músicas?",
      url: "https://www.youtube.com/embed/TgTq_dTzUJQ",
      originalUrl: "https://youtube.com/shorts/TgTq_dTzUJQ?feature=share",
    },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div>
        <h1 className="text-3xl font-bold text-[#0f0f0f] tracking-tight flex items-center gap-3">
          <HelpCircle className="text-[#0a1f44]" size={32} />
          Como usar?
        </h1>
        <p className="text-gray-500 mt-1">
          Tutoriais rápidos para ajudar você a navegar no sistema
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {tutorials.map((tutorial, index) => (
          <div key={index} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-6 border-b border-gray-50 bg-gray-50/30">
              <h2 className="text-xl font-bold text-[#0a1f44] flex items-center gap-2">
                <PlayCircle size={20} />
                {tutorial.title}
              </h2>
            </div>
            <div className="p-6">
              <div className="aspect-[9/16] max-w-[300px] mx-auto bg-black rounded-xl overflow-hidden shadow-lg border border-gray-200">
                <iframe
                  width="100%"
                  height="100%"
                  src={tutorial.url}
                  title={tutorial.title}
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                ></iframe>
              </div>
              <div className="mt-6 text-center">
                <a
                  href={tutorial.originalUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 font-medium transition-colors"
                >
                  Ver no YouTube <PlayCircle size={16} />
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-blue-50 p-6 rounded-2xl border border-blue-100">
        <h3 className="text-blue-900 font-bold mb-2">Dica:</h3>
        <p className="text-blue-800 text-sm leading-relaxed">
          Os vídeos acima são YouTube Shorts. Se eles não carregarem corretamente no seu dispositivo, você pode clicar no link abaixo de cada vídeo para assisti-los diretamente no aplicativo do YouTube.
        </p>
      </div>
    </div>
  );
}
