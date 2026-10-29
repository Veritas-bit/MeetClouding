"use client";

import { useMemo, useState } from "react";

type Cloud = {
  id: number;
  title: string;
  category: string;
  detail: string;
  time: string;
  people: number;
  color: string;
  x: number;
  y: number;
};

const initialClouds: Cloud[] = [
  { id: 1, title: "Кофе?", category: "Еда", detail: "Хочу выпить хороший кофе, но открыт(а) к интересным местам и спонтанным идеям.", time: "Сейчас", people: 2, color: "lavender", x: 22, y: 23 },
  { id: 2, title: "Прогуляться", category: "Прогулки", detail: "Выйти проветрить голову. Маршрут и направление можно выбрать вместе.", time: "Ближайший час", people: 1, color: "mint", x: 59, y: 18 },
  { id: 3, title: "Что-нибудь вкусное", category: "Еда", detail: "Найти новое место с едой. Не обязательно идти туда, что задумал(а) изначально.", time: "Сегодня", people: 3, color: "peach", x: 76, y: 43 },
  { id: 4, title: "Настолки", category: "Игры", detail: "Есть настроение поиграть. Можно выбрать игру и место вместе.", time: "Вечером", people: 2, color: "blue", x: 37, y: 51 },
  { id: 5, title: "Удиви меня", category: "Спонтанно", detail: "Хочется выбраться куда-нибудь, но конкретного плана нет. Предложи что-то неожиданное.", time: "Сейчас", people: 1, color: "pink", x: 18, y: 70 },
  { id: 6, title: "Поболтать", category: "Общение", detail: "Неформальное общение без жёсткого сценария. Посмотрим, куда заведёт разговор.", time: "Сегодня", people: 2, color: "yellow", x: 67, y: 75 },
];

const categories = ["Все", "Еда", "Прогулки", "Игры", "Общение", "Спонтанно"];

export default function CloudMapPreviewPage() {
  const [selectedCategory, setSelectedCategory] = useState("Все");
  const [selectedCloud, setSelectedCloud] = useState<Cloud | null>(null);
  const [interested, setInterested] = useState<number[]>([]);
  const [showCreate, setShowCreate] = useState(false);
  const [newWish, setNewWish] = useState("");
  const [clouds, setClouds] = useState(initialClouds);
  const [notice, setNotice] = useState("");

  const visibleClouds = useMemo(
    () => clouds.filter((cloud) => selectedCategory === "Все" || cloud.category === selectedCategory),
    [clouds, selectedCategory],
  );

  function addCloud() {
    const title = newWish.trim();
    if (!title) return;
    const newCloud: Cloud = {
      id: Date.now(),
      title,
      category: "Спонтанно",
      detail: "Твоё текущее желание. Оно может измениться — можно смотреть другие облачка и выбирать то, что откликается сейчас.",
      time: "Сейчас",
      people: 1,
      color: "pink",
      x: 43,
      y: 37,
    };
    setClouds((items) => [newCloud, ...items]);
    setSelectedCategory("Все");
    setSelectedCloud(newCloud);
    setShowCreate(false);
    setNewWish("");
    setNotice("Облачко добавлено только в этот демо-сеанс — оно не публикуется для других людей.");
  }

  return (
    <main className="min-h-[100dvh] bg-[#f7f6fb] text-[#26243a]">
      <div className="mx-auto flex min-h-[100dvh] max-w-[1600px] flex-col lg:flex-row">
        <aside className="z-10 flex w-full shrink-0 flex-col border-b border-[#e8e4f0] bg-white/95 p-4 backdrop-blur lg:w-[360px] lg:border-b-0 lg:border-r lg:p-6">
          <div className="flex items-center gap-3">
            <div className="grid h-11 w-11 place-items-center rounded-2xl bg-gradient-to-br from-[#8e72e8] to-[#ed8bc8] text-xl text-white shadow-md">☁</div>
            <div>
              <p className="text-xl font-extrabold tracking-tight">MeetCloud</p>
              <p className="text-xs text-[#817c96]">Карта спонтанных желаний</p>
            </div>
            <span className="ml-auto rounded-full bg-[#fff3dc] px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-[#8c651b]">Preview</span>
          </div>

          <div className="mt-6">
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#8d84a6]">Куда потянет сегодня?</p>
            <h1 className="mt-2 text-2xl font-extrabold leading-tight sm:text-3xl">План может измениться.<br /><span className="text-[#8d72df]">И это нормально.</span></h1>
            <p className="mt-3 max-w-xl text-sm leading-6 text-[#77718c]">Даже если сейчас хочется кофе, рядом может найтись что-то интереснее. Посмотри на облачка и выбери то, что откликается.</p>
          </div>

          <div className="mt-5 flex gap-2 overflow-x-auto pb-1 lg:flex-wrap">
            {categories.map((category) => (
              <button key={category} onClick={() => setSelectedCategory(category)} className={`shrink-0 rounded-full px-3.5 py-2 text-xs font-bold transition ${selectedCategory === category ? "bg-[#7863d8] text-white shadow-md shadow-violet-200" : "bg-[#f2eff9] text-[#746d8d] hover:bg-[#e9e3f8]"}`}>
                {category}
              </button>
            ))}
          </div>

          <div className="mt-5 hidden space-y-2 lg:block">
            <p className="mb-3 text-xs font-bold uppercase tracking-[0.14em] text-[#9b95ad]">Облачка рядом · демо</p>
            {visibleClouds.map((cloud) => (
              <button key={cloud.id} onClick={() => setSelectedCloud(cloud)} className={`flex w-full items-center gap-3 rounded-2xl border p-3 text-left transition hover:-translate-y-0.5 hover:shadow-md ${selectedCloud?.id === cloud.id ? "border-[#a997ef] bg-[#f8f5ff]" : "border-[#efecf5] bg-white"}`}>
                <span className={`grid h-11 w-11 shrink-0 place-items-center rounded-2xl text-lg ${cloud.color === "mint" ? "bg-[#e0f7ee]" : cloud.color === "peach" ? "bg-[#ffeadf]" : cloud.color === "blue" ? "bg-[#e3edff]" : cloud.color === "pink" ? "bg-[#ffe5f2]" : cloud.color === "yellow" ? "bg-[#fff2c8]" : "bg-[#eee8ff]"}`}>☁</span>
                <span className="min-w-0 flex-1"><span className="block font-bold">{cloud.title}</span><span className="mt-0.5 block truncate text-xs text-[#89839d]">{cloud.time} · {cloud.people} {cloud.people === 1 ? "человек" : "чел."}</span></span>
                <span className="text-lg text-[#b3a9d0]">›</span>
              </button>
            ))}
          </div>

          <div className="mt-5 lg:mt-auto lg:pt-8">
            <button onClick={() => setShowCreate(true)} className="w-full rounded-2xl bg-gradient-to-r from-[#7863d8] to-[#b17ce4] px-5 py-4 text-sm font-extrabold text-white shadow-lg shadow-violet-200 transition hover:brightness-105 active:scale-[0.99]">＋ Создать облачко</button>
            <p className="mt-3 text-center text-[11px] leading-5 text-[#9b95ad]">Интерес — не обещание встретиться.<br />Можно передумать и выбрать другое.</p>
          </div>
        </aside>

        <section className="relative flex min-h-[560px] flex-1 flex-col p-3 sm:p-5 lg:min-h-screen lg:p-7">
          <div className="relative min-h-[540px] flex-1 overflow-hidden rounded-[28px] border border-white bg-[#eeedf7] shadow-inner sm:rounded-[34px]">
            <div className="absolute inset-0 opacity-70" style={{ backgroundImage: "radial-gradient(#d7d2e8 1px, transparent 1px)", backgroundSize: "22px 22px" }} />
            <div className="absolute inset-0 opacity-80" aria-hidden="true">
              <div className="absolute left-[10%] top-[-10%] h-[120%] w-7 rotate-[22deg] rounded-full bg-white/80 sm:w-10" />
              <div className="absolute left-[35%] top-[-10%] h-[120%] w-10 rotate-[-17deg] rounded-full bg-white/80 sm:w-14" />
              <div className="absolute left-[66%] top-[-10%] h-[120%] w-8 rotate-[31deg] rounded-full bg-white/80 sm:w-12" />
              <div className="absolute left-[-10%] top-[29%] h-8 w-[120%] rotate-[-8deg] rounded-full bg-white/80 sm:h-12" />
              <div className="absolute left-[-10%] top-[62%] h-10 w-[120%] rotate-[7deg] rounded-full bg-white/80 sm:h-14" />
              <div className="absolute left-[46%] top-[10%] h-[20%] w-[18%] rounded-[30%] border-2 border-white/90 bg-[#e4e1f1]/80" />
              <div className="absolute left-[15%] top-[44%] h-[15%] w-[22%] rounded-[28%] border-2 border-white/90 bg-[#e4e1f1]/80" />
              <div className="absolute left-[70%] top-[53%] h-[16%] w-[18%] rounded-[28%] border-2 border-white/90 bg-[#e4e1f1]/80" />
            </div>

            <div className="absolute left-4 right-4 top-4 flex items-start justify-between gap-3 sm:left-6 sm:right-6 sm:top-6">
              <div className="rounded-2xl border border-white/80 bg-white/90 px-4 py-3 shadow-sm backdrop-blur">
                <p className="text-sm font-extrabold">Что происходит рядом</p>
                <p className="mt-1 text-xs text-[#8d86a2]">{visibleClouds.length} облачка · тестовый режим</p>
              </div>
              <div className="rounded-2xl border border-white/80 bg-white/90 px-3 py-2 text-xs font-semibold text-[#7f7895] shadow-sm backdrop-blur">⌖ Геолокация выключена</div>
            </div>

            {visibleClouds.map((cloud, index) => (
              <button key={cloud.id} onClick={() => setSelectedCloud(cloud)} style={{ left: `${cloud.x}%`, top: `${cloud.y}%`, animationDelay: `${index * 120}ms` }} className={`cloud-bubble absolute z-[1] -translate-x-1/2 -translate-y-1/2 rounded-[48%] border-2 px-3 py-3 text-center shadow-lg transition hover:z-10 hover:scale-110 sm:px-5 sm:py-4 ${cloud.color === "mint" ? "border-[#c6eddf] bg-[#e0f7ee]" : cloud.color === "peach" ? "border-[#f6d2c2] bg-[#ffeadf]" : cloud.color === "blue" ? "border-[#ccdafa] bg-[#e3edff]" : cloud.color === "pink" ? "border-[#f4cce1] bg-[#ffe5f2]" : cloud.color === "yellow" ? "border-[#f3e1a4] bg-[#fff2c8]" : "border-[#d8cef8] bg-[#eee8ff]"} ${selectedCloud?.id === cloud.id ? "ring-4 ring-white ring-offset-2 ring-offset-[#b5a8e7]" : ""}`}>
                <span className="block text-[10px] opacity-60 sm:text-xs">☁</span>
                <span className="block max-w-[100px] text-[11px] font-extrabold leading-tight sm:max-w-[140px] sm:text-sm">{cloud.title}</span>
                <span className="mt-1 block text-[9px] text-[#79718f] sm:text-[10px]">{cloud.time}</span>
              </button>
            ))}

            <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between gap-3 sm:bottom-6 sm:left-6 sm:right-6">
              <div className="max-w-[240px] rounded-2xl border border-white/80 bg-white/90 px-4 py-3 text-xs leading-5 text-[#817a96] shadow-sm backdrop-blur">Это схематичная карта для просмотра интерфейса, не реальные улицы и не реальные пользователи.</div>
              <button onClick={() => { setSelectedCategory("Все"); setSelectedCloud(null); }} className="rounded-2xl border border-white bg-white/95 px-4 py-3 text-sm font-bold text-[#70668f] shadow-md transition hover:bg-white">↻ Обзор</button>
            </div>
          </div>

          <div className="mt-3 flex items-center justify-center gap-2 text-[11px] text-[#a09ab2]">
            <span className="h-1.5 w-1.5 rounded-full bg-[#a9dfc8]" /> Интерактивный макет · адаптируется под телефон и компьютер
          </div>
        </section>
      </div>

      {selectedCloud && (
        <div className="fixed inset-0 z-30 flex items-end justify-center bg-[#29243d]/35 p-0 backdrop-blur-[2px] sm:items-center sm:p-4" onClick={() => setSelectedCloud(null)}>
          <section role="dialog" aria-modal="true" aria-label={selectedCloud.title} onClick={(event) => event.stopPropagation()} className="w-full max-w-md rounded-t-[30px] border border-white bg-white p-6 shadow-2xl sm:rounded-[30px]">
            <div className="mx-auto mb-5 h-1.5 w-12 rounded-full bg-[#e9e4f2] sm:hidden" />
            <div className="flex items-start gap-4">
              <div className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-[#eee8ff] text-2xl">☁</div>
              <div className="min-w-0 flex-1"><p className="text-xs font-bold uppercase tracking-widest text-[#968bb7]">{selectedCloud.category} · {selectedCloud.time}</p><h2 className="mt-1 text-2xl font-extrabold">{selectedCloud.title}</h2><p className="mt-1 text-xs text-[#918aa5]">{selectedCloud.people} {selectedCloud.people === 1 ? "человек" : "человека"} в демо-карточке</p></div>
              <button aria-label="Закрыть" onClick={() => setSelectedCloud(null)} className="rounded-full bg-[#f5f2fa] px-3 py-2 text-[#827a98]">✕</button>
            </div>
            <p className="mt-5 text-sm leading-6 text-[#706a83]">{selectedCloud.detail}</p>
            <div className="mt-5 rounded-2xl bg-[#f8f5ff] p-4 text-xs leading-5 text-[#786d9b]">💜 Это интерес, а не обязательство. Можно продолжать смотреть другие облачка и выбрать другое желание в любой момент.</div>
            <button onClick={() => { setInterested((current) => current.includes(selectedCloud.id) ? current.filter((id) => id !== selectedCloud.id) : [...current, selectedCloud.id]); setNotice(interested.includes(selectedCloud.id) ? "Интерес снят в локальном демо." : "Интерес отмечен только в локальном демо. Другой пользователь его не увидит."); }} className={`mt-5 w-full rounded-2xl px-5 py-4 text-sm font-extrabold transition ${interested.includes(selectedCloud.id) ? "bg-[#eeeaf8] text-[#7966bf]" : "bg-gradient-to-r from-[#7863d8] to-[#b17ce4] text-white shadow-lg shadow-violet-200"}`}>{interested.includes(selectedCloud.id) ? "✓ Мне интересно · отменить" : "Мне интересно"}</button>
            <button onClick={() => setSelectedCloud(null)} className="mt-2 w-full rounded-2xl px-5 py-3 text-sm font-bold text-[#8b849e] hover:bg-[#f8f6fc]">Продолжить исследовать карту</button>
          </section>
        </div>
      )}

      {showCreate && (
        <div className="fixed inset-0 z-40 flex items-end justify-center bg-[#29243d]/35 p-0 backdrop-blur-[2px] sm:items-center sm:p-4" onClick={() => setShowCreate(false)}>
          <section role="dialog" aria-modal="true" aria-label="Создать облачко" onClick={(event) => event.stopPropagation()} className="w-full max-w-md rounded-t-[30px] bg-white p-6 shadow-2xl sm:rounded-[30px]">
            <h2 className="text-2xl font-extrabold">Что тебе сейчас хочется?</h2>
            <p className="mt-2 text-sm leading-6 text-[#817a96]">Необязательно знать точный план. Можно написать настроение или первое желание.</p>
            <input autoFocus value={newWish} onChange={(event) => setNewWish(event.target.value)} onKeyDown={(event) => { if (event.key === "Enter") addCloud(); }} maxLength={60} placeholder="Например, выбраться куда-нибудь…" className="mt-5 w-full rounded-2xl border border-[#e6e0f2] bg-[#fbfaff] px-4 py-4 text-sm outline-none transition focus:border-[#a594e9] focus:ring-4 focus:ring-[#eee9ff]" />
            <button onClick={addCloud} className="mt-4 w-full rounded-2xl bg-gradient-to-r from-[#7863d8] to-[#b17ce4] px-5 py-4 text-sm font-extrabold text-white">Добавить облачко</button>
            <button onClick={() => setShowCreate(false)} className="mt-2 w-full rounded-2xl px-5 py-3 text-sm font-bold text-[#8b849e]">Отмена</button>
          </section>
        </div>
      )}

      {notice && <div role="status" className="fixed bottom-4 left-4 right-4 z-50 mx-auto max-w-lg rounded-2xl border border-white bg-[#29243d] px-5 py-4 text-sm leading-5 text-white shadow-2xl">{notice}<button onClick={() => setNotice("")} className="ml-3 font-bold text-[#d8ccff]">Ок</button></div>}

      <style jsx global>{`
        @keyframes cloudFloat { 0%, 100% { transform: translate(-50%, -50%) translateY(0); } 50% { transform: translate(-50%, -50%) translateY(-5px); } }
        .cloud-bubble { animation: cloudFloat 4.2s ease-in-out infinite; }
        @media (prefers-reduced-motion: reduce) { .cloud-bubble { animation: none; } }
      `}</style>
    </main>
  );
}
