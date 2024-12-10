import { useState } from 'react';
import ordersData from '../../data/orders.json';

interface Order {
    orderId: string;
    orderDate: string;
    status: 'pending' | 'completed';
    customerInfo: {
        name: string;
        phone: string;
        email: string;
        address: string;
    };
    orderItems: {
        productName: string;
        quantity: number;
        price: number;
    }[];
    totalAmount: number;
}

export default function FindOrder() {
    const [phone, setPhone] = useState('');
    const [orders, setOrders] = useState<Order[]>([]);
    const [error, setError] = useState('');

    const normalizePhoneNumber = (phone: string) => {
        // Remove all non-digit characters
        return phone.replace(/\D/g, '');
    };

    const validatePhoneNumber = (phone: string) => {
        const normalizedPhone = normalizePhoneNumber(phone);
        // Check if the normalized phone number has 10 digits and starts with 0
        return /^0\d{9}$/.test(normalizedPhone);
    };

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        // Reset results and error first
        setOrders([]);
        setError('');

        const normalizedPhone = normalizePhoneNumber(phone);

        if (!normalizedPhone) {
            setError('Vui lòng nhập số điện thoại');
            return;
        }

        if (!validatePhoneNumber(normalizedPhone)) {
            setError('Số điện thoại không hợp lệ');
            return;
        }

        const foundOrders = ordersData.orders.filter(order => 
            normalizePhoneNumber(order.customerInfo.phone).includes(normalizedPhone)
        );

        if (foundOrders.length === 0) {
            setError('Không tìm thấy đơn hàng nào');
        } else {
            setOrders(foundOrders as Order[]);
        }
    };

    const handleClear = () => {
        setPhone('');
        setOrders([]);
        setError('');
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="max-w-2xl mx-auto">
                <h1 className="text-2xl font-bold mb-6">Tra cứu đơn hàng</h1>
                
                <form onSubmit={handleSearch} className="mb-8">
                    <div className="flex gap-4">
                        <input
                            type="tel"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            placeholder="Nhập số điện thoại..."
                            className="flex-1 px-4 py-2 border rounded-lg"
                        />
                        <button 
                            type="submit"
                            className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600"
                        >
                            Tìm kiếm
                        </button>

                    </div>
                    {error && <p className="text-red-500 mt-2">{error}</p>}
                </form>

                {orders.map(order => (
                    <div key={order.orderId} className="bg-white rounded-lg shadow-md p-6 mb-4">
                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <p className="font-semibold">Mã đơn: {order.orderId}</p>
                                <p className="text-gray-600">
                                    {new Date(order.orderDate).toLocaleDateString('vi-VN')}
                                </p>
                            </div>
                            <span className={`px-3 py-1 rounded-full text-sm ${
                                order.status === 'completed' 
                                    ? 'bg-green-100 text-green-800' 
                                    : 'bg-yellow-100 text-yellow-800'
                            }`}>
                                {order.status === 'completed' ? 'Đã hoàn thành' : 'Đang xử lý'}
                            </span>
                        </div>

                        <div className="space-y-4">
                            {order.orderItems.map((item, index) => (
                                <div key={index} className="flex justify-between">
                                    <div>
                                        <p className="font-medium">{item.productName}</p>
                                        <p className="text-gray-600">SL: {item.quantity}</p>
                                    </div>
                                    <p className="font-medium">
                                        {item.price.toLocaleString('vi-VN')}đ
                                    </p>
                                </div>
                            ))}
                        </div>

                        <div className="border-t mt-4 pt-4">
                            <div className="flex justify-between">
                                <p className="font-semibold">Tổng tiền:</p>
                                <p className="font-bold text-blue-600">
                                    {order.totalAmount.toLocaleString('vi-VN')}đ
                                </p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}