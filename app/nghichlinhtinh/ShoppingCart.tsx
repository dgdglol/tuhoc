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
        <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto', display: 'flex', gap: '40px' }}>
            {/* Cột hiển thị danh sách sản phẩm */}
            <div style={{ flex: 1 }}>
                <h3>Danh sách Sản phẩm</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {DUMMY_PRODUCTS.map((product) => (
                        <div key={product.id} style={{ border: '1px solid #ccc', padding: '10px', borderRadius: '8px' }}>
                            <h4>{product.name}</h4>
                            <p>Giá: {product.price.toLocaleString()} VNĐ</p>
                            <button
                                onClick={() => addToCart(product)}
                                style={{ padding: '5px 10px', backgroundColor: '#4CAF50', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                            >
                                Thêm vào giỏ
                            </button>
                        </div>
                    ))}
                </div>
            </div>

            {/* Cột hiển thị giỏ hàng */}
            <div style={{ flex: 1, padding: '20px', backgroundColor: '#f9f9f9', borderRadius: '8px' }}>
                <h3>Giỏ hàng của bạn</h3>
                {cartItems.length === 0 ? (
                    <p>Giỏ hàng đang trống.</p>
                ) : (
                    <>
                        <ul style={{ listStyle: 'none', padding: 0 }}>
                            {cartItems.map((item) => (
                                <li key={item.id} style={{ marginBottom: '15px', borderBottom: '1px solid #ddd', paddingBottom: '10px' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <div>
                                            <strong>{item.name}</strong> x {item.quantity}
                                        </div>
                                        <div>{(item.price * item.quantity).toLocaleString()} VNĐ</div>
                                    </div>
                                    <button
                                        onClick={() => removeFromCart(item.id)}
                                        style={{ marginTop: '5px', padding: '3px 8px', backgroundColor: '#f44336', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '12px' }}
                                    >
                                        Giảm/Xóa
                                    </button>
                                </li>
                            ))}
                        </ul>
                        <hr />
                        <h4 style={{ textAlign: 'right' }}>Tổng tiền: {totalPrice.toLocaleString()} VNĐ</h4>
                    </>
                )}
            </div>
        </div>
    );
};

export default ShoppingCartUI;
