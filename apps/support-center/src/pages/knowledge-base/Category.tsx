import React from 'react';
import { useParams } from 'react-router-dom';

const Category: React.FC = () => {
  const { slug } = useParams();

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-gray-900">Category: {slug}</h1>
      <p className="text-gray-600 mt-2">Articles in this category</p>
    </div>
  );
};

export default Category;