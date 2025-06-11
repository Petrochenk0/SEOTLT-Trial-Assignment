import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [news, setNews] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [formValues, setFormValues] = useState({ title: '', text: '' });

  // Загружаем данные из localStorage при монтировании
  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('news')) || [];
    setNews(saved);
  }, []);

  // Сохраняем в localStorage при изменении news
  useEffect(() => {
    localStorage.setItem('news', JSON.stringify(news));
  }, [news]);

  // Обработчики формы
  const handleChange = (e) => {
    setFormValues({
      ...formValues,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formValues.title.trim() || !formValues.text.trim()) return;

    if (editingId) {
      setNews(news.map((item) => (item.id === editingId ? { ...item, ...formValues } : item)));
      setEditingId(null);
    } else {
      const newItem = {
        id: Date.now(),
        ...formValues,
      };
      setNews([newItem, ...news]);
    }
    setFormValues({ title: '', text: '' });
  };

  const handleEdit = (item) => {
    setEditingId(item.id);
    setFormValues({ title: item.title, text: item.text });
  };

  const handleDelete = (id) => {
    setNews(news.filter((item) => item.id !== id));
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

// Форма добавления/редактирования
function NewsForm({ formValues, handleChange, handleSubmit, isEditing }) {
  return (
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
}

// Список новостей
function NewsList({ news, onEdit, onDelete }) {
  return (
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
}

export default App;
