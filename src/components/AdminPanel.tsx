import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';
import { useToast } from '@/hooks/use-toast';

interface Order {
  id: number;
  tracking_number: string;
  customer_name: string;
  customer_phone: string;
  weight: number;
  price: number;
  status_name: string;
  status_color: string;
  created_at: string;
  to_city: string;
}

interface Status {
  id: number;
  name: string;
  color: string;
  description: string;
  order_position: number;
}

interface PickupPoint {
  id: number;
  name: string;
  country: string;
  city: string;
  address: string;
  phone: string;
  working_hours: string;
  is_active: boolean;
}

export const AdminPanel = () => {
  const { toast } = useToast();
  const [orders, setOrders] = useState<Order[]>([]);
  const [statuses, setStatuses] = useState<Status[]>([]);
  const [pickupPoints, setPickupPoints] = useState<PickupPoint[]>([]);
  const [loading, setLoading] = useState(false);
  
  const [newStatus, setNewStatus] = useState({ name: '', color: '#0EA5E9', description: '' });
  const [newPoint, setNewPoint] = useState({
    name: '',
    country: 'russia',
    city: '',
    address: '',
    phone: '',
    working_hours: ''
  });

  const [selectedOrder, setSelectedOrder] = useState<string>('');
  const [newOrderStatus, setNewOrderStatus] = useState<string>('');
  const [statusComment, setStatusComment] = useState('');

  useEffect(() => {
    fetchOrders();
    fetchStatuses();
    fetchPickupPoints();
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await fetch('https://functions.poehali.dev/1103543a-5f23-479b-a2d4-37323b5551f5');
      const data = await res.json();
      setOrders(data.orders || []);
    } catch (error) {
      console.error('Error fetching orders:', error);
    }
  };

  const fetchStatuses = async () => {
    try {
      const res = await fetch('https://functions.poehali.dev/615d69e1-df15-4e0f-a0f1-bbd3b4416757');
      const data = await res.json();
      setStatuses(data.statuses || []);
    } catch (error) {
      console.error('Error fetching statuses:', error);
    }
  };

  const fetchPickupPoints = async () => {
    try {
      const res = await fetch('https://functions.poehali.dev/aaa55b1f-ab08-4528-8fc3-3845d9f583fd');
      const data = await res.json();
      setPickupPoints(data.points || []);
    } catch (error) {
      console.error('Error fetching pickup points:', error);
    }
  };

  const handleUpdateOrderStatus = async () => {
    if (!selectedOrder || !newOrderStatus) {
      toast({
        title: '❌ Ошибка',
        description: 'Выберите заказ и новый статус',
        variant: 'destructive'
      });
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('https://functions.poehali.dev/1103543a-5f23-479b-a2d4-37323b5551f5', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          order_id: parseInt(selectedOrder),
          status_id: parseInt(newOrderStatus),
          comment: statusComment
        })
      });

      if (res.ok) {
        toast({
          title: '✅ Статус обновлен',
          description: 'Статус заказа успешно изменен'
        });
        fetchOrders();
        setSelectedOrder('');
        setNewOrderStatus('');
        setStatusComment('');
      }
    } catch (error: any) {
      toast({
        title: '❌ Ошибка',
        description: error.message,
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAddStatus = async () => {
    if (!newStatus.name) {
      toast({
        title: '❌ Ошибка',
        description: 'Укажите название статуса',
        variant: 'destructive'
      });
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('https://functions.poehali.dev/615d69e1-df15-4e0f-a0f1-bbd3b4416757', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newStatus)
      });

      if (res.ok) {
        toast({
          title: '✅ Статус добавлен',
          description: 'Новый статус успешно создан'
        });
        fetchStatuses();
        setNewStatus({ name: '', color: '#0EA5E9', description: '' });
      }
    } catch (error: any) {
      toast({
        title: '❌ Ошибка',
        description: error.message,
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAddPickupPoint = async () => {
    if (!newPoint.name || !newPoint.city || !newPoint.address) {
      toast({
        title: '❌ Ошибка',
        description: 'Заполните все обязательные поля',
        variant: 'destructive'
      });
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('https://functions.poehali.dev/aaa55b1f-ab08-4528-8fc3-3845d9f583fd', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newPoint)
      });

      if (res.ok) {
        toast({
          title: '✅ Пункт добавлен',
          description: 'Новый пункт выдачи успешно создан'
        });
        fetchPickupPoints();
        setNewPoint({
          name: '',
          country: 'russia',
          city: '',
          address: '',
          phone: '',
          working_hours: ''
        });
      }
    } catch (error: any) {
      toast({
        title: '❌ Ошибка',
        description: error.message,
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">Админ-панель</h1>
          <p className="text-slate-600">Управление заказами и настройками</p>
        </div>
        <Badge className="bg-green-100 text-green-700 text-sm py-1 px-3">
          <Icon name="Shield" size={16} className="mr-1" />
          Администратор
        </Badge>
      </div>

      <Tabs defaultValue="orders" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="orders">
            <Icon name="Package" size={18} className="mr-2" />
            Заказы
          </TabsTrigger>
          <TabsTrigger value="statuses">
            <Icon name="Tag" size={18} className="mr-2" />
            Статусы
          </TabsTrigger>
          <TabsTrigger value="points">
            <Icon name="MapPin" size={18} className="mr-2" />
            Пункты выдачи
          </TabsTrigger>
        </TabsList>

        <TabsContent value="orders" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Обновление статуса заказа</CardTitle>
              <CardDescription>Измените статус выбранного заказа</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-3 gap-4">
                <div>
                  <Label>Выберите заказ</Label>
                  <Select value={selectedOrder} onValueChange={setSelectedOrder}>
                    <SelectTrigger>
                      <SelectValue placeholder="Трек-номер" />
                    </SelectTrigger>
                    <SelectContent>
                      {orders.map((order) => (
                        <SelectItem key={order.id} value={order.id.toString()}>
                          {order.tracking_number} - {order.customer_name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Новый статус</Label>
                  <Select value={newOrderStatus} onValueChange={setNewOrderStatus}>
                    <SelectTrigger>
                      <SelectValue placeholder="Выберите статус" />
                    </SelectTrigger>
                    <SelectContent>
                      {statuses.map((status) => (
                        <SelectItem key={status.id} value={status.id.toString()}>
                          {status.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Комментарий</Label>
                  <Input
                    value={statusComment}
                    onChange={(e) => setStatusComment(e.target.value)}
                    placeholder="Комментарий (опционально)"
                  />
                </div>
              </div>
              <Button onClick={handleUpdateOrderStatus} disabled={loading}>
                <Icon name="Check" size={18} className="mr-2" />
                Обновить статус
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Список заказов</CardTitle>
              <CardDescription>Всего заказов: {orders.length}</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Трек-номер</TableHead>
                    <TableHead>Клиент</TableHead>
                    <TableHead>Телефон</TableHead>
                    <TableHead>Город</TableHead>
                    <TableHead>Вес</TableHead>
                    <TableHead>Цена</TableHead>
                    <TableHead>Статус</TableHead>
                    <TableHead>Дата</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {orders.map((order) => (
                    <TableRow key={order.id}>
                      <TableCell className="font-mono">{order.tracking_number}</TableCell>
                      <TableCell>{order.customer_name}</TableCell>
                      <TableCell>{order.customer_phone}</TableCell>
                      <TableCell>{order.to_city}</TableCell>
                      <TableCell>{order.weight} кг</TableCell>
                      <TableCell>{order.price} ₽</TableCell>
                      <TableCell>
                        <Badge style={{ backgroundColor: order.status_color + '20', color: order.status_color }}>
                          {order.status_name}
                        </Badge>
                      </TableCell>
                      <TableCell>{new Date(order.created_at).toLocaleDateString('ru-RU')}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="statuses" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Добавить новый статус</CardTitle>
              <CardDescription>Создайте пользовательский статус для заказов</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-3 gap-4">
                <div>
                  <Label>Название статуса</Label>
                  <Input
                    value={newStatus.name}
                    onChange={(e) => setNewStatus({ ...newStatus, name: e.target.value })}
                    placeholder="Например: Ожидает отправки"
                  />
                </div>
                <div>
                  <Label>Цвет</Label>
                  <Input
                    type="color"
                    value={newStatus.color}
                    onChange={(e) => setNewStatus({ ...newStatus, color: e.target.value })}
                  />
                </div>
                <div>
                  <Label>Описание</Label>
                  <Input
                    value={newStatus.description}
                    onChange={(e) => setNewStatus({ ...newStatus, description: e.target.value })}
                    placeholder="Краткое описание"
                  />
                </div>
              </div>
              <Button onClick={handleAddStatus} disabled={loading}>
                <Icon name="Plus" size={18} className="mr-2" />
                Добавить статус
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Список статусов</CardTitle>
              <CardDescription>Всего статусов: {statuses.length}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {statuses.map((status) => (
                  <div key={status.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-8 h-8 rounded-full"
                        style={{ backgroundColor: status.color }}
                      />
                      <div>
                        <p className="font-semibold">{status.name}</p>
                        <p className="text-sm text-slate-500">{status.description}</p>
                      </div>
                    </div>
                    <Badge variant="outline">Позиция: {status.order_position}</Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="points" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Добавить новый пункт выдачи</CardTitle>
              <CardDescription>Создайте новый пункт в России или Абхазии</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label>Название</Label>
                  <Input
                    value={newPoint.name}
                    onChange={(e) => setNewPoint({ ...newPoint, name: e.target.value })}
                    placeholder="Пункт выдачи Центральный"
                  />
                </div>
                <div>
                  <Label>Страна</Label>
                  <Select value={newPoint.country} onValueChange={(value) => setNewPoint({ ...newPoint, country: value })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="russia">🇷🇺 Россия</SelectItem>
                      <SelectItem value="abkhazia">🇦🇧 Абхазия</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Город</Label>
                  <Input
                    value={newPoint.city}
                    onChange={(e) => setNewPoint({ ...newPoint, city: e.target.value })}
                    placeholder="Адлер"
                  />
                </div>
                <div>
                  <Label>Адрес</Label>
                  <Input
                    value={newPoint.address}
                    onChange={(e) => setNewPoint({ ...newPoint, address: e.target.value })}
                    placeholder="ул. Ленина, 10"
                  />
                </div>
                <div>
                  <Label>Телефон</Label>
                  <Input
                    value={newPoint.phone}
                    onChange={(e) => setNewPoint({ ...newPoint, phone: e.target.value })}
                    placeholder="+7 940 713 1999"
                  />
                </div>
                <div>
                  <Label>Часы работы</Label>
                  <Input
                    value={newPoint.working_hours}
                    onChange={(e) => setNewPoint({ ...newPoint, working_hours: e.target.value })}
                    placeholder="Пн-Сб: 9:00-20:00"
                  />
                </div>
              </div>
              <Button onClick={handleAddPickupPoint} disabled={loading}>
                <Icon name="Plus" size={18} className="mr-2" />
                Добавить пункт
              </Button>
            </CardContent>
          </Card>

          <div className="grid md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>🇷🇺 Пункты в России</CardTitle>
                <CardDescription>Пункты забора посылок</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {pickupPoints.filter(p => p.country === 'russia').map((point) => (
                    <div key={point.id} className="p-3 border rounded-lg">
                      <p className="font-semibold">{point.name}</p>
                      <p className="text-sm text-slate-600">{point.city}, {point.address}</p>
                      <p className="text-xs text-slate-500">{point.phone}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>🇦🇧 Пункты в Абхазии</CardTitle>
                <CardDescription>Пункты доставки посылок</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {pickupPoints.filter(p => p.country === 'abkhazia').map((point) => (
                    <div key={point.id} className="p-3 border rounded-lg">
                      <p className="font-semibold">{point.name}</p>
                      <p className="text-sm text-slate-600">{point.city}, {point.address}</p>
                      <p className="text-xs text-slate-500">{point.phone}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};
