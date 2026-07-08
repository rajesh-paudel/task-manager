export default function Testimonial() {
  return (
    <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20 border-t border-slate-100">
      <blockquote className="max-w-2xl mx-auto text-center">
        <p className="text-xl sm:text-2xl text-slate-900 font-medium leading-snug">
          "We stopped losing track of who owned what. That alone paid for itself
          in the first week."
        </p>
        <footer className="mt-6 flex items-center justify-center gap-3">
          <img
            src="https://i.pravatar.cc/80?img=47"
            alt=""
            className="h-9 w-9 rounded-full object-cover"
          />
          <div className="text-left">
            <p className="text-sm font-semibold text-slate-900">Meera Shah</p>
            <p className="text-xs text-slate-500">Ops Lead, Loop Studio</p>
          </div>
        </footer>
      </blockquote>
    </section>
  );
}
