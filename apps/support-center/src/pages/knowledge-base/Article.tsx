import React from 'react';
import { useParams } from 'react-router-dom';

const Article: React.FC = () => {
  const { slug } = useParams();

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-gray-900">Article: {slug}</h1>
      <p className="text-gray-600 mt-2">Article content will be displayed here</p>
    </div>
  );
};

export default Article;