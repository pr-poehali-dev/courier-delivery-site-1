import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';
import { OrderForm } from '@/components/OrderForm';
import { AdminPanel } from '@/components/AdminPanel';
import { Toaster } from '@/components/ui/toaster';

const Index = () => {
  const [weight, setWeight] = useState<number>(1);
  const [length, setLength] = useState<number>(30);
  const [width, setWidth] = useState<number>(30);
  const [height, setHeight] = useState<number>(30);
  const [activeSection, setActiveSection] = useState<string>('home');

  const calculatePrice = () => {
    const volumeWeight = (length * width * height) / 5000;
    const finalWeight = Math.max(weight, volumeWeight);
    
    if (finalWeight >= 10) {
      return finalWeight * 100;
    } else {
      return finalWeight * 120;
    }
  };

  const price = calculatePrice();

  const partners = [
    { name: 'OZON', icon: 'Package' },
    { name: 'Wildberries', icon: 'ShoppingBag' },
    { name: 'Яндекс Маркет', icon: 'Store' },
    { name: 'Почта России', icon: 'Mail' },
    { name: 'ПЭК', icon: 'Truck' },
    { name: 'Boxberry', icon: 'Box' }
  ];

  const advantages = [
    { icon: 'Clock', title: 'Быстрая доставка', description: 'От 3 до 7 дней' },
    { icon: 'Shield', title: 'Страхование груза', description: 'Полная защита посылки' },
    { icon: 'MapPin', title: 'Отслеживание', description: 'В режиме реального времени' },
    { icon: 'Headphones', title: 'Поддержка 24/7', description: 'Всегда на связи' }
  ];

  const trackingSteps = [
    { icon: 'PackageCheck', title: 'Получен', status: 'completed' },
    { icon: 'Warehouse', title: 'На складе', status: 'completed' },
    { icon: 'Truck', title: 'В пути', status: 'active' },
    { icon: 'Home', title: 'Доставлен', status: 'pending' }
  ];

  const navItems = [
    { id: 'home', label: 'Главная', icon: 'Home' },
    { id: 'order', label: 'Оформить заказ', icon: 'ShoppingCart' },
    { id: 'calculator', label: 'Калькулятор', icon: 'Calculator' },
    { id: 'tracking', label: 'Отслеживание', icon: 'Search' },
    { id: 'admin', label: 'Админ', icon: 'Shield' },
    { id: 'contacts', label: 'Контакты', icon: 'Phone' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200 shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="bg-blue-500 p-2 rounded-lg">
                <Icon name="Package" className="text-white" size={28} />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-slate-800">РусАбхаз</h1>
                <p className="text-xs text-slate-500">Доставка без границ</p>
              </div>
            </div>
            <nav className="hidden md:flex items-center gap-1">
              {navItems.map((item) => (
                <Button
                  key={item.id}
                  variant={activeSection === item.id ? 'default' : 'ghost'}
                  onClick={() => setActiveSection(item.id)}
                  className="gap-2"
                >
                  <Icon name={item.icon} size={18} />
                  {item.label}
                </Button>
              ))}
            </nav>
            <Button className="bg-orange-500 hover:bg-orange-600">
              <Icon name="LogIn" size={18} className="mr-2" />
              Войти
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      {activeSection === 'home' && (
        <>
          <section className="relative py-20 px-4 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-orange-500/10" />
            <div className="container mx-auto relative z-10 mb-16">
              <div className="max-w-4xl mx-auto">
                <div className="text-center mb-8">
                  <Badge className="mb-4 bg-orange-100 text-orange-700">
                    🎥 Видео о нашей работе
                  </Badge>
                  <h3 className="text-3xl font-bold text-slate-800 mb-4">Как мы доставляем ваши посылки</h3>
                  <p className="text-lg text-slate-600 mb-2">Доставка посылок из Адлера в Абхазию от 1 дня</p>
                  <div className="flex justify-center gap-4 mt-4">
                    <a href="tel:+79407131999" className="text-blue-600 hover:underline font-semibold flex items-center gap-2">
                      <Icon name="Phone" size={18} />
                      +7 940 713 1999
                    </a>
                    <a href="tel:+79409061999" className="text-blue-600 hover:underline font-semibold flex items-center gap-2">
                      <Icon name="Phone" size={18} />
                      +7 940 906 1999
                    </a>
                  </div>
                </div>
                <Card className="shadow-2xl overflow-hidden">
                  <CardContent className="p-0">
                    <div className="relative aspect-video bg-slate-900 flex items-center justify-center">
                      <div className="text-center text-white">
                        <Icon name="Play" size={64} className="mx-auto mb-4 opacity-70" />
                        <p className="text-lg">Здесь будет размещено ваше видео</p>
                        <p className="text-sm text-slate-400 mt-2">Загрузите видео о доставке через админ-панель</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
            <section className="relative py-20 px-4 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-orange-500/10" />
            <div className="container mx-auto relative z-10">
              <div className="grid lg:grid-cols-2 gap-12 items-center">
                <div className="animate-fade-in">
                  <Badge className="mb-4 bg-blue-100 text-blue-700 hover:bg-blue-200">
                    🚀 Доставка из России в Абхазию
                  </Badge>
                  <h2 className="text-5xl lg:text-6xl font-bold text-slate-800 mb-6 leading-tight">
                    Ваши посылки —<br />
                    <span className="text-blue-500">наша забота</span>
                  </h2>
                  <p className="text-xl text-slate-600 mb-8">
                    Забираем посылки с OZON, Wildberries, Яндекс Маркет и доставляем прямо в Абхазию. 
                    Быстро, надёжно, выгодно.
                  </p>
                  <div className="flex flex-wrap gap-4">
                    <Button 
                      size="lg" 
                      className="bg-blue-500 hover:bg-blue-600 text-lg px-8"
                      onClick={() => setActiveSection('calculator')}
                    >
                      <Icon name="Calculator" size={20} className="mr-2" />
                      Рассчитать стоимость
                    </Button>
                    <Button 
                      size="lg" 
                      variant="outline" 
                      className="text-lg px-8"
                      onClick={() => setActiveSection('tracking')}
                    >
                      <Icon name="Search" size={20} className="mr-2" />
                      Отследить посылку
                    </Button>
                  </div>
                </div>
                <div className="relative animate-fade-in">
                  <div className="bg-gradient-to-br from-blue-500 to-orange-500 rounded-3xl p-8 shadow-2xl">
                    <div className="bg-white rounded-2xl p-6">
                      <div className="flex items-center gap-4 mb-6">
                        <div className="bg-green-100 p-3 rounded-full">
                          <Icon name="TrendingUp" className="text-green-600" size={28} />
                        </div>
                        <div>
                          <p className="text-sm text-slate-500">Доставлено в этом месяце</p>
                          <p className="text-3xl font-bold text-slate-800">1,247+</p>
                        </div>
                      </div>
                      <Separator className="my-4" />
                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="text-slate-600">Средняя скорость</span>
                          <span className="font-semibold">5 дней</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-slate-600">Довольных клиентов</span>
                          <span className="font-semibold">98%</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Partners Section */}
          <section className="py-16 px-4 bg-white">
            <div className="container mx-auto">
              <h3 className="text-center text-sm text-slate-500 mb-8 uppercase tracking-wider">
                Забираем посылки из
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
                {partners.map((partner) => (
                  <Card 
                    key={partner.name} 
                    className="hover:shadow-lg transition-all hover:-translate-y-1 cursor-pointer"
                  >
                    <CardContent className="flex flex-col items-center justify-center p-6">
                      <div className="bg-blue-50 p-4 rounded-full mb-3">
                        <Icon name={partner.icon} className="text-blue-500" size={32} />
                      </div>
                      <p className="font-semibold text-slate-700 text-center">{partner.name}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </section>

          {/* Advantages Section */}
          <section className="py-20 px-4">
            <div className="container mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-4xl font-bold text-slate-800 mb-4">Почему выбирают нас?</h2>
                <p className="text-xl text-slate-600">Преимущества работы с РусАбхаз</p>
              </div>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                {advantages.map((advantage, index) => (
                  <Card 
                    key={index} 
                    className="hover:shadow-xl transition-all hover:-translate-y-2 animate-fade-in"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <CardHeader>
                      <div className="bg-gradient-to-br from-blue-500 to-orange-500 w-14 h-14 rounded-xl flex items-center justify-center mb-4">
                        <Icon name={advantage.icon} className="text-white" size={28} />
                      </div>
                      <CardTitle className="text-xl">{advantage.title}</CardTitle>
                      <CardDescription className="text-base">{advantage.description}</CardDescription>
                    </CardHeader>
                  </Card>
                ))}
              </div>
            </div>
          </section>

          {/* CTA Section */}
          <section className="py-20 px-4 bg-gradient-to-r from-blue-500 to-orange-500">
            <div className="container mx-auto text-center">
              <h2 className="text-4xl font-bold text-white mb-6">Готовы отправить посылку?</h2>
              <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
                Зарегистрируйтесь прямо сейчас и получите скидку 10% на первую доставку
              </p>
              <Button 
                size="lg" 
                className="bg-white text-blue-600 hover:bg-slate-100 text-lg px-8"
              >
                <Icon name="Rocket" size={20} className="mr-2" />
                Начать работу
              </Button>
            </div>
          </section>
        </>
      )}

      {/* Calculator Section */}
      {activeSection === 'calculator' && (
        <section className="py-20 px-4">
          <div className="container mx-auto max-w-4xl">
            <div className="text-center mb-12 animate-fade-in">
              <Badge className="mb-4 bg-orange-100 text-orange-700">
                <Icon name="Calculator" size={16} className="mr-2" />
                Калькулятор стоимости
              </Badge>
              <h2 className="text-4xl font-bold text-slate-800 mb-4">Рассчитайте стоимость доставки</h2>
              <p className="text-xl text-slate-600">
                От 1 кг — 120₽/кг | От 10 кг — 100₽/кг
              </p>
            </div>

            <Card className="shadow-xl animate-scale-in">
              <CardHeader>
                <CardTitle className="text-2xl">Параметры посылки</CardTitle>
                <CardDescription>Укажите вес и габариты для расчёта</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="weight" className="text-base mb-2 flex items-center gap-2">
                      <Icon name="Weight" size={18} />
                      Вес (кг)
                    </Label>
                    <Input
                      id="weight"
                      type="number"
                      value={weight}
                      onChange={(e) => setWeight(Number(e.target.value))}
                      min="0.1"
                      step="0.1"
                      className="text-lg"
                    />
                  </div>
                  <div>
                    <Label htmlFor="length" className="text-base mb-2 flex items-center gap-2">
                      <Icon name="Ruler" size={18} />
                      Длина (см)
                    </Label>
                    <Input
                      id="length"
                      type="number"
                      value={length}
                      onChange={(e) => setLength(Number(e.target.value))}
                      min="1"
                      className="text-lg"
                    />
                  </div>
                  <div>
                    <Label htmlFor="width" className="text-base mb-2">Ширина (см)</Label>
                    <Input
                      id="width"
                      type="number"
                      value={width}
                      onChange={(e) => setWidth(Number(e.target.value))}
                      min="1"
                      className="text-lg"
                    />
                  </div>
                  <div>
                    <Label htmlFor="height" className="text-base mb-2">Высота (см)</Label>
                    <Input
                      id="height"
                      type="number"
                      value={height}
                      onChange={(e) => setHeight(Number(e.target.value))}
                      min="1"
                      className="text-lg"
                    />
                  </div>
                </div>

                <Separator />

                <div className="bg-gradient-to-r from-blue-50 to-orange-50 rounded-xl p-8 text-center">
                  <p className="text-slate-600 mb-2 text-lg">Стоимость доставки</p>
                  <p className="text-5xl font-bold text-blue-600 mb-4">
                    {price.toFixed(0)} ₽
                  </p>
                  <p className="text-sm text-slate-500">
                    Объёмный вес: {((length * width * height) / 5000).toFixed(2)} кг
                  </p>
                </div>

                <Button 
                  className="w-full bg-orange-500 hover:bg-orange-600 text-lg py-6"
                  onClick={() => setActiveSection('order')}
                >
                  <Icon name="ShoppingCart" size={20} className="mr-2" />
                  Оформить заказ
                </Button>
              </CardContent>
            </Card>
          </div>
        </section>
      )}

      {/* Tracking Section */}
      {activeSection === 'tracking' && (
        <section className="py-20 px-4">
          <div className="container mx-auto max-w-4xl">
            <div className="text-center mb-12 animate-fade-in">
              <Badge className="mb-4 bg-blue-100 text-blue-700">
                <Icon name="MapPin" size={16} className="mr-2" />
                Отслеживание посылки
              </Badge>
              <h2 className="text-4xl font-bold text-slate-800 mb-4">Где моя посылка?</h2>
              <p className="text-xl text-slate-600">
                Введите номер отслеживания для проверки статуса
              </p>
            </div>

            <Card className="shadow-xl mb-8 animate-scale-in">
              <CardContent className="pt-6">
                <div className="flex gap-4">
                  <Input
                    placeholder="Введите трек-номер (например: RA123456789RU)"
                    className="text-lg"
                  />
                  <Button className="bg-blue-500 hover:bg-blue-600 px-8">
                    <Icon name="Search" size={20} className="mr-2" />
                    Найти
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-xl animate-fade-in">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-2xl mb-2">Посылка #RA123456789RU</CardTitle>
                    <CardDescription className="text-base">
                      Отправлено: 25 января 2026 | Ожидаемая доставка: 1 февраля 2026
                    </CardDescription>
                  </div>
                  <Badge className="bg-green-100 text-green-700 text-sm py-1 px-3">
                    В пути
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-8">
                  {trackingSteps.map((step, index) => (
                    <div key={index} className="flex gap-4 relative">
                      {index < trackingSteps.length - 1 && (
                        <div 
                          className={`absolute left-6 top-14 w-0.5 h-16 ${
                            step.status === 'completed' ? 'bg-green-500' : 'bg-slate-200'
                          }`}
                        />
                      )}
                      <div 
                        className={`flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center ${
                          step.status === 'completed' 
                            ? 'bg-green-500' 
                            : step.status === 'active'
                            ? 'bg-blue-500 animate-pulse'
                            : 'bg-slate-200'
                        }`}
                      >
                        <Icon 
                          name={step.icon} 
                          className={step.status === 'pending' ? 'text-slate-400' : 'text-white'} 
                          size={24} 
                        />
                      </div>
                      <div className="flex-grow pt-2">
                        <h4 className={`font-semibold text-lg ${
                          step.status === 'pending' ? 'text-slate-400' : 'text-slate-800'
                        }`}>
                          {step.title}
                        </h4>
                        <p className="text-slate-500 text-sm">
                          {step.status === 'completed' && '✓ Выполнено'}
                          {step.status === 'active' && '⏳ В процессе...'}
                          {step.status === 'pending' && 'Ожидается'}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </section>
      )}

      {/* Footer */}
      <footer className="bg-slate-900 text-white py-12 px-4">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="bg-blue-500 p-2 rounded-lg">
                  <Icon name="Package" className="text-white" size={24} />
                </div>
                <h3 className="text-xl font-bold">РусАбхаз</h3>
              </div>
              <p className="text-slate-400">
                Надёжная доставка посылок из России в Абхазию
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Компания</h4>
              <ul className="space-y-2 text-slate-400">
                <li><a href="#" className="hover:text-white transition-colors">О сервисе</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Блог</a></li>
                <li><a href="#" className="hover:text-white transition-colors">FAQ</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Сервис</h4>
              <ul className="space-y-2 text-slate-400">
                <li><a href="#" className="hover:text-white transition-colors">Калькулятор</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Отслеживание</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Тарифы</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Контакты</h4>
              <ul className="space-y-2 text-slate-400">
                <li className="flex items-center gap-2">
                  <Icon name="Phone" size={16} />
                  +7 940 713 1999
                </li>
                <li className="flex items-center gap-2">
                  <Icon name="Phone" size={16} />
                  +7 940 906 1999
                </li>
                <li className="flex items-center gap-2">
                  <Icon name="MapPin" size={16} />
                  Адлер, Россия
                </li>
              </ul>
            </div>
          </div>
          <Separator className="bg-slate-700 mb-8" />
          <div className="flex flex-col md:flex-row justify-between items-center text-slate-400 text-sm">
            <p>© 2026 РусАбхаз. Все права защищены.</p>
            <div className="flex gap-4 mt-4 md:mt-0">
              <a href="#" className="hover:text-white transition-colors">Политика конфиденциальности</a>
              <a href="#" className="hover:text-white transition-colors">Условия использования</a>
            </div>
          </div>
        </div>
      </footer>

      {/* Order Form Section */}
      {activeSection === 'order' && (
        <section className="py-20 px-4">
          <div className="container mx-auto max-w-4xl">
            <div className="text-center mb-12 animate-fade-in">
              <Badge className="mb-4 bg-orange-100 text-orange-700">
                <Icon name="ShoppingCart" size={16} className="mr-2" />
                Оформление заказа
              </Badge>
              <h2 className="text-4xl font-bold text-slate-800 mb-4">Создайте заявку на доставку</h2>
              <p className="text-xl text-slate-600">
                Заполните форму и мы свяжемся с вами в ближайшее время
              </p>
            </div>
            <OrderForm />
          </div>
        </section>
      )}

      {/* Admin Panel Section */}
      {activeSection === 'admin' && (
        <section className="py-20 px-4 bg-slate-50">
          <div className="container mx-auto max-w-7xl">
            <AdminPanel />
          </div>
        </section>
      )}

      {/* Mobile Navigation */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 shadow-lg z-50">
        <div className="flex justify-around py-3">
          {navItems.slice(0, 5).map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveSection(item.id)}
              className={`flex flex-col items-center gap-1 px-3 py-1 rounded-lg transition-colors ${
                activeSection === item.id 
                  ? 'text-blue-500' 
                  : 'text-slate-600'
              }`}
            >
              <Icon name={item.icon} size={20} />
              <span className="text-xs">{item.label}</span>
            </button>
          ))}
        </div>
      </div>
      <Toaster />
    </div>
  );
};

export default Index;