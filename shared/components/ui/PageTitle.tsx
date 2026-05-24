export default function PageTitle({
  title,
  underline = true,
}: {
  title: string;
  underline?: boolean;
}) {
  return (
    <div className="flex flex-col items-center mt-6">
      <div className="grid *:[grid-area:1/1]">
        <span className="translate-x-1 font-jocham text-6xl text-brand-pink-light dark:text-brand-pink leading-none">
          {title}
        </span>
        <span className="blur-md font-jocham text-6xl text-brand-pink/40 dark:text-brand-purple/25 leading-none">
          {title}
        </span>
        <span className="font-jocham text-6xl text-brand-black dark:text-brand-dark-surface-0 leading-none text-shadow-[-1px_-1px_0px] text-shadow-brand-blue dark:text-shadow-brand-purple">
          {title}
        </span>
        <span className="translate-x-1 font-jocham text-6xl text-transparent [text-stroke:1.5px_rgba(40,40,40,0.25)] [-webkit-text-stroke:1.5px_rgba(40,40,40,0.25)]">
          {title}
        </span>
      </div>
      {underline && (
        <div className="flex items-center gap-2 mt-1 mb-1">
          <div className="w-25 h-0.5 dark:bg-brand-pink-light/40 bg-brand-pink/50" />
          <span className="dark:text-brand-pink-light/40 text-brand-pink/70 text-lg">✦</span>
          <div className="w-25 h-0.5 dark:bg-brand-pink-light/40 bg-brand-pink/50" />
        </div>
      )}
    </div>
  );
}