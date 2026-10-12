import React from 'react';
import { CartProps, Product } from './withCart';

const DUMMY_PRODUCTS: Product[] = [
  { id: 1, name: 'Áo thun nam', price: 150000 },
  { id: 2, name: 'Quần Jeans', price: 350000 },
  { id: 3, name: 'Giày Sneaker', price: 500000 },
];

const ShoppingCartUI: React.FC<CartProps> = ({
  cartItems,
  addToCart,
  removeFromCart,
  totalPrice,
}) => {
  return (
    <div className="w-full max-w-4xl mx-auto p-4 md:p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Cột hiển thị danh sách sản phẩm */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs">
        <h3 className="text-lg font-bold text-slate-800 mb-4 pb-2 border-b border-slate-100 flex items-center gap-2">
          🛍️ Danh sách Sản phẩm
        </h3>
        <div className="flex flex-col gap-3">
          {DUMMY_PRODUCTS.map((product) => (
            <div
              key={product.id}
              className="border border-slate-200 rounded-xl p-4 flex items-center justify-between hover:border-slate-300 hover:shadow-xs transition-all bg-slate-50/50"
            >
              <div>
                <h4 className="font-semibold text-slate-800 text-sm">{product.name}</h4>
                <p className="text-sm font-medium text-emerald-600 mt-0.5">
                  {product.price.toLocaleString('vi-VN')} VNĐ
                </p>
              </div>
              <button
                type="button"
                onClick={() => addToCart(product)}
                className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white text-xs font-medium rounded-lg shadow-xs transition-all cursor-pointer"
              >
                + Thêm vào giỏ
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Cột hiển thị giỏ hàng */}
      <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 shadow-xs flex flex-col justify-between">
        <div>
          <h3 className="text-lg font-bold text-slate-800 mb-4 pb-2 border-b border-slate-200 flex items-center justify-between">
            <span>🛒 Giỏ hàng của bạn</span>
            <span className="text-xs font-normal bg-white border border-slate-200 px-2 py-0.5 rounded-full text-slate-600">
              {cartItems.reduce((acc, item) => acc + item.quantity, 0)} món
            </span>
          </h3>

          {cartItems.length === 0 ? (
            <div className="py-8 text-center text-slate-400 text-sm italic">
              Giỏ hàng đang trống. Hãy thêm sản phẩm ở bên trái!
            </div>
          ) : (
            <ul className="divide-y divide-slate-200">
              {cartItems.map((item) => (
                <li key={item.id} className="py-3 flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-slate-800 truncate">
                      {item.name}
                    </p>
                    <p className="text-xs text-slate-500">
                      {item.price.toLocaleString('vi-VN')} VNĐ × {item.quantity}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-semibold text-slate-700">
                      {(item.price * item.quantity).toLocaleString('vi-VN')} đ
                    </span>
                    <button
                      type="button"
                      onClick={() => removeFromCart(item.id)}
                      className="px-2 py-1 bg-rose-50 hover:bg-rose-100 text-rose-600 text-xs font-medium rounded border border-rose-200 transition-colors cursor-pointer"
                      title="Giảm số lượng / Xóa"
                    >
                      Giảm
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {cartItems.length > 0 && (
          <div className="mt-4 pt-4 border-t border-slate-200">
            <div className="flex justify-between items-center">
              <span className="text-slate-600 font-medium text-sm">Tổng cộng:</span>
              <span className="text-lg font-bold text-emerald-600">
                {totalPrice.toLocaleString('vi-VN')} VNĐ
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ShoppingCartUI;
