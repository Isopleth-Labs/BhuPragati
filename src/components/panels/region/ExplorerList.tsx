import { memo } from "react";

export type ExplorerItem = {
  id: string;
  title: string;
  subtitle?: string;
  meta?: string;
};

type ExplorerListProps = {
  title: string;
  items: ExplorerItem[];
  onSelect: (id: string) => void;
};

function ExplorerList({ title, items, onSelect }: ExplorerListProps) {
  return (
    <section className="panel-surface explorer" aria-label={title}>
      <header className="explorer__header">
        <p className="panel-kicker">{title}</p>
      </header>
      <ul className="explorer__list">
        {items.map((item) => (
          <li key={item.id} className="explorer__item">
            <button type="button" className="explorer__button" onClick={() => onSelect(item.id)}>
              <div className="explorer__titles">
                <span className="explorer__title">{item.title}</span>
                {item.subtitle ? <span className="explorer__subtitle">{item.subtitle}</span> : null}
              </div>
              {item.meta ? <span className="explorer__meta">{item.meta}</span> : null}
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
}

export default memo(ExplorerList);
