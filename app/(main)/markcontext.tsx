import React, { createContext, useState, ReactNode, useContext } from 'react';

// 1. Định nghĩa kiểu dữ liệu cho một "Mark"
interface Mark {
  id: string;
  value: number; // Hoặc tọa độ x, y nếu là bản đồ
  label: string;
}

// 2. Định nghĩa những gì Context này sẽ cung cấp ra ngoài
interface MarksContextType {
  marks: Mark[];
  addMark: (mark: Mark) => void;
  removeMark: (id: string) => void;
}

// 3. Khởi tạo Context
const MarksContext = createContext<MarksContextType | undefined>(undefined);

// 4. Tạo Provider để bọc các component con
export const MarksProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [marks, setMarks] = useState<Mark[]>([]);

  const addMark = (mark: Mark) => {
    setMarks((prev) => [...prev, mark]);
  };

  const removeMark = (id: string) => {
    setMarks((prev) => prev.filter((m) => m.id !== id));
  };

  return (
    <MarksContext.Provider value={{ marks, addMark, removeMark }}>
      {children}
    </MarksContext.Provider>
  );
};

// 5. Custom hook để sử dụng Context dễ dàng hơn
export const useMarks = () => {
  const context = useContext(MarksContext);
  if (!context) {
    throw new Error('useMarks phải được sử dụng bên trong MarksProvider');
  }
  return context;
};