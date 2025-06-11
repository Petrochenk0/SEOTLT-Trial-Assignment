import { useState, useEffect } from 'react';
import './App.css';

interface NewsItem {
  id: number;
  title: string;
  text: string;
}

function App() {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formValues, setFormValues] = useState<Omit<NewsItem, 'id'>>({
    title: '',
    text: '',
  });

  useEffect(() => {
    const saved = localStorage.getItem('news');
    if (saved) {
      try {
        setNews(JSON.parse(saved));
      } catch (e) {
        console.error('Ошибка парсинга localStorage', e);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('news', JSON.stringify(news));
  }, [news]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormValues({
      ...formValues,
      [name]: value,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formValues.title.trim() || !formValues.text.trim()) return;

    if (editingId) {
      setNews((prev) =>
        prev.map((item) =>
          item.id === editingId
            ? { ...item, title: formValues.title, text: formValues.text }
            : item,
        ),
      );
      setEditingId(null);
    } else {
      const newItem: NewsItem = {
        id: Date.now(),
        title: formValues.title,
        text: formValues.text,
      };
      setNews((prev) => [newItem, ...prev]);
    }

    setFormValues({ title: '', text: '' });
  };

  const handleEdit = (item: NewsItem) => {
    setEditingId(item.id);
    setFormValues({ title: item.title, text: item.text });
  };

  const handleDelete = (id: number) => {
    setNews((prev) => prev.filter((item) => item.id !== id));
  };

  return (
    <div className="app">
      <h1>📝 Новости</h1>
      <NewsForm
        formValues={formValues}
        handleChange={handleChange}
        handleSubmit={handleSubmit}
        isEditing={!!editingId}
      />
      <NewsList news={news} onEdit={handleEdit} onDelete={handleDelete} />
    </div>
  );
}

type NewsFormProps = {
  formValues: { title: string; text: string };
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  handleSubmit: (e: React.FormEvent) => void;
  isEditing: boolean;
};

const NewsForm = ({ formValues, handleChange, handleSubmit, isEditing }: NewsFormProps) => (
  <form onSubmit={handleSubmit} className="news-form">
    <input
      type="text"
      name="title"
      placeholder="Заголовок"
      value={formValues.title}
      onChange={handleChange}
      required
    />
    <textarea
      name="text"
      placeholder="Текст новости"
      value={formValues.text}
      onChange={handleChange}
      required
    />
    <button type="submit">{isEditing ? 'Обновить' : 'Добавить'}</button>
  </form>
);

type NewsListProps = {
  news: NewsItem[];
  onEdit: (item: NewsItem) => void;
  onDelete: (id: number) => void;
};

const NewsList = ({ news, onEdit, onDelete }: NewsListProps) => (
  <ul className="news-list">
    {news.length === 0 && <p>Новостей пока нет</p>}
    {news.map((item) => (
      <li key={item.id} className="news-item">
        <h3>{item.title}</h3>
        <p>{item.text}</p>
        <div className="news-actions">
          <button onClick={() => onEdit(item)}>✏️</button>
          <button onClick={() => onDelete(item.id)}>🗑️</button>
        </div>
      </li>
    ))}
  </ul>
);

export default App;
