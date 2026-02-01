import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Separator } from '@/components/ui/separator';
import Icon from '@/components/ui/icon';
import { useToast } from '@/hooks/use-toast';

interface PickupPoint {
  id: number;
  name: string;
  country: string;
  city: string;
  address: string;
  phone: string;
  working_hours: string;
}

export const OrderForm = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [pickupPointsFrom, setPickupPointsFrom] = useState<PickupPoint[]>([]);
  const [pickupPointsTo, setPickupPointsTo] = useState<PickupPoint[]>([]);
  
  const [formData, setFormData] = useState({
    customer_name: '',
    customer_phone: '',
    customer_email: '',
    pickup_point_from: '',
    pickup_point_to: '',
    delivery_type: 'pickup',
    delivery_address: '',
    weight: 1,
    length: 30,
    width: 30,
    height: 30,
    notes: ''
  });

  const [qrCodeFile, setQrCodeFile] = useState<File | null>(null);
  const [screenshotFile, setScreenshotFile] = useState<File | null>(null);
  const [qrCodePreview, setQrCodePreview] = useState<string>('');
  const [screenshotPreview, setScreenshotPreview] = useState<string>('');

  useEffect(() => {
    fetchPickupPoints();
  }, []);

  const fetchPickupPoints = async () => {
    try {
      const russiaRes = await fetch('https://functions.poehali.dev/aaa55b1f-ab08-4528-8fc3-3845d9f583fd?country=russia');
      const russiaData = await russiaRes.json();
      setPickupPointsFrom(russiaData.points || []);

      const abkhaziaRes = await fetch('https://functions.poehali.dev/aaa55b1f-ab08-4528-8fc3-3845d9f583fd?country=abkhazia');
      const abkhaziaData = await abkhaziaRes.json();
      setPickupPointsTo(abkhaziaData.points || []);
    } catch (error) {
      console.error('Error fetching pickup points:', error);
    }
  };

  const calculatePrice = () => {
    const volumeWeight = (formData.length * formData.width * formData.height) / 5000;
    const finalWeight = Math.max(formData.weight, volumeWeight);
    return finalWeight >= 10 ? finalWeight * 100 : finalWeight * 120;
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: 'qr' | 'screenshot') => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (type === 'qr') {
      setQrCodeFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setQrCodePreview(reader.result as string);
      reader.readAsDataURL(file);
    } else {
      setScreenshotFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setScreenshotPreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = (reader.result as string).split(',')[1];
        resolve(base64);
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const payload: any = {
        ...formData,
        pickup_point_from: parseInt(formData.pickup_point_from),
        pickup_point_to: parseInt(formData.pickup_point_to),
        price: calculatePrice()
      };

      if (qrCodeFile) {
        payload.qr_code_base64 = await fileToBase64(qrCodeFile);
      }

      if (screenshotFile) {
        payload.screenshot_base64 = await fileToBase64(screenshotFile);
      }

      const response = await fetch('https://functions.poehali.dev/1103543a-5f23-479b-a2d4-37323b5551f5', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const result = await response.json();

      if (response.ok) {
        toast({
          title: '✅ Заказ создан!',
          description: `Ваш трек-номер: ${result.tracking_number}`,
        });

        setFormData({
          customer_name: '',
          customer_phone: '',
          customer_email: '',
          pickup_point_from: '',
          pickup_point_to: '',
          delivery_type: 'pickup',
          delivery_address: '',
          weight: 1,
          length: 30,
          width: 30,
          height: 30,
          notes: ''
        });
        setQrCodeFile(null);
        setScreenshotFile(null);
        setQrCodePreview('');
        setScreenshotPreview('');
      } else {
        throw new Error(result.error || 'Ошибка создания заказа');
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

  const price = calculatePrice();

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl flex items-center gap-2">
            <Icon name="User" size={24} />
            Контактные данные
          </CardTitle>
          <CardDescription>Укажите информацию для связи</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="name">ФИО *</Label>
            <Input
              id="name"
              value={formData.customer_name}
              onChange={(e) => setFormData({ ...formData, customer_name: e.target.value })}
              placeholder="Иванов Иван Иванович"
              required
            />
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="phone">Телефон *</Label>
              <Input
                id="phone"
                type="tel"
                value={formData.customer_phone}
                onChange={(e) => setFormData({ ...formData, customer_phone: e.target.value })}
                placeholder="+7 999 123-45-67"
                required
              />
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={formData.customer_email}
                onChange={(e) => setFormData({ ...formData, customer_email: e.target.value })}
                placeholder="example@mail.ru"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-2xl flex items-center gap-2">
            <Icon name="MapPin" size={24} />
            Маршрут доставки
          </CardTitle>
          <CardDescription>Выберите пункты отправки и получения</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="from">Откуда забрать посылку *</Label>
            <Select value={formData.pickup_point_from} onValueChange={(value) => setFormData({ ...formData, pickup_point_from: value })}>
              <SelectTrigger>
                <SelectValue placeholder="Выберите пункт в России" />
              </SelectTrigger>
              <SelectContent>
                {pickupPointsFrom.map((point) => (
                  <SelectItem key={point.id} value={point.id.toString()}>
                    <div className="flex flex-col">
                      <span className="font-semibold">{point.name}</span>
                      <span className="text-xs text-slate-500">{point.address}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="to">Куда доставить *</Label>
            <Select value={formData.pickup_point_to} onValueChange={(value) => setFormData({ ...formData, pickup_point_to: value })}>
              <SelectTrigger>
                <SelectValue placeholder="Выберите пункт в Абхазии" />
              </SelectTrigger>
              <SelectContent>
                {pickupPointsTo.map((point) => (
                  <SelectItem key={point.id} value={point.id.toString()}>
                    <div className="flex flex-col">
                      <span className="font-semibold">{point.name}</span>
                      <span className="text-xs text-slate-500">{point.address}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>Тип доставки *</Label>
            <RadioGroup value={formData.delivery_type} onValueChange={(value) => setFormData({ ...formData, delivery_type: value })}>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="pickup" id="pickup" />
                <Label htmlFor="pickup" className="font-normal cursor-pointer">
                  Самовывоз из пункта выдачи
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="home" id="home" />
                <Label htmlFor="home" className="font-normal cursor-pointer">
                  Доставка на дом
                </Label>
              </div>
            </RadioGroup>
          </div>

          {formData.delivery_type === 'home' && (
            <div>
              <Label htmlFor="address">Адрес доставки *</Label>
              <Textarea
                id="address"
                value={formData.delivery_address}
                onChange={(e) => setFormData({ ...formData, delivery_address: e.target.value })}
                placeholder="Укажите полный адрес с указанием улицы, дома, квартиры"
                rows={3}
              />
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-2xl flex items-center gap-2">
            <Icon name="Package" size={24} />
            Параметры посылки
          </CardTitle>
          <CardDescription>Укажите вес и габариты</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="weight">Вес (кг) *</Label>
              <Input
                id="weight"
                type="number"
                step="0.1"
                min="0.1"
                value={formData.weight}
                onChange={(e) => setFormData({ ...formData, weight: parseFloat(e.target.value) })}
                required
              />
            </div>
            <div>
              <Label htmlFor="length">Длина (см) *</Label>
              <Input
                id="length"
                type="number"
                min="1"
                value={formData.length}
                onChange={(e) => setFormData({ ...formData, length: parseFloat(e.target.value) })}
                required
              />
            </div>
            <div>
              <Label htmlFor="width">Ширина (см) *</Label>
              <Input
                id="width"
                type="number"
                min="1"
                value={formData.width}
                onChange={(e) => setFormData({ ...formData, width: parseFloat(e.target.value) })}
                required
              />
            </div>
            <div>
              <Label htmlFor="height">Высота (см) *</Label>
              <Input
                id="height"
                type="number"
                min="1"
                value={formData.height}
                onChange={(e) => setFormData({ ...formData, height: parseFloat(e.target.value) })}
                required
              />
            </div>
          </div>

          <Separator />

          <div className="bg-gradient-to-r from-blue-50 to-orange-50 rounded-xl p-6">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-slate-600 text-sm">Стоимость доставки</p>
                <p className="text-3xl font-bold text-blue-600">{price.toFixed(0)} ₽</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-slate-500">Объёмный вес</p>
                <p className="font-semibold">{((formData.length * formData.width * formData.height) / 5000).toFixed(2)} кг</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-2xl flex items-center gap-2">
            <Icon name="Image" size={24} />
            Документы
          </CardTitle>
          <CardDescription>Прикрепите QR-код или скриншот посылки</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="qr">QR-код посылки</Label>
            <Input
              id="qr"
              type="file"
              accept="image/*"
              onChange={(e) => handleFileChange(e, 'qr')}
            />
            {qrCodePreview && (
              <div className="mt-2">
                <img src={qrCodePreview} alt="QR Preview" className="w-32 h-32 object-cover rounded-lg border" />
              </div>
            )}
          </div>

          <div>
            <Label htmlFor="screenshot">Скриншот заказа</Label>
            <Input
              id="screenshot"
              type="file"
              accept="image/*"
              onChange={(e) => handleFileChange(e, 'screenshot')}
            />
            {screenshotPreview && (
              <div className="mt-2">
                <img src={screenshotPreview} alt="Screenshot Preview" className="w-full max-w-md rounded-lg border" />
              </div>
            )}
          </div>

          <div>
            <Label htmlFor="notes">Комментарий к заказу</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              placeholder="Дополнительная информация о посылке"
              rows={3}
            />
          </div>
        </CardContent>
      </Card>

      <Button 
        type="submit" 
        size="lg" 
        className="w-full bg-orange-500 hover:bg-orange-600 text-lg py-6"
        disabled={loading}
      >
        {loading ? (
          <>
            <Icon name="Loader" size={20} className="mr-2 animate-spin" />
            Отправка...
          </>
        ) : (
          <>
            <Icon name="Send" size={20} className="mr-2" />
            Оформить заказ — {price.toFixed(0)} ₽
          </>
        )}
      </Button>
    </form>
  );
};
