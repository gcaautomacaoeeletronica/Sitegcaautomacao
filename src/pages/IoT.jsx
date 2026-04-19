import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useScroll, useTransform, motion } from 'framer-motion';
import { FadeIn, SlideIn, StaggerContainer, StaggerItem } from '../components/ui/AnimWrapper';
import SEO from '../components/ui/SEO';
import {
  Wifi, Droplets, Thermometer, Zap, Server, ArrowRight, ExternalLink,
  Activity, Radio, Shield, Cloud, BarChart3, Bell, Cpu, Globe,
  ChevronRight, CheckCircle, MonitorDot, Database
} from 'lucide-react';

// ─── Animated Counter ───────────────────────────────────────────────────
const Counter = ({ end, suffix = '', duration = 2000 }) => {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const started = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !started.current) {
        started.current = true;
        let start = 0;
        const step = end / (duration / 16);
        const timer = setInterval(() => {
          start += step;
          if (start >= end) { setCount(end); clearInterval(timer); }
          else setCount(Math.floor(start));
        }, 16);
      }
    });
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [end, duration]);

  return <span ref={ref}>{count}{suffix}</span>;
};

// ─── Animated Signal Dot ────────────────────────────────────────────────
const SignalDot = ({ color = 'bg-green-400', delay = '0s' }) => (
  <span className="relative flex h-3 w-3">
    <span className={`animate-ping absolute inline-flex h-full w-full rounded-full ${color} opacity-75`} style={{ animationDelay: delay }}></span>
    <span className={`relative inline-flex rounded-full h-3 w-3 ${color}`}></span>
  </span>
);

// ─── Sensor Card ─────────────────────────────────────────────────────────
const SensorCard = ({ icon: Icon, title, value, unit, color, bg, description, delay }) => (
  <StaggerItem>
    <div className={`group relative rounded-2xl p-8 overflow-hidden border transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl cursor-default ${bg}`}>
      {/* Glow */}
      <div className={`absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-500 ${color.replace('text-', 'bg-')}`}></div>
      {/* Live indicator */}
      <div className="absolute top-5 right-5 flex items-center gap-2">
        <SignalDot color={color.replace('text-', 'bg-').replace('400', '500')} />
        <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">LIVE</span>
      </div>
      <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 ${color.replace('text-', 'bg-')}/10 border ${color.replace('text-', 'border-')}/20`}>
        <Icon size={26} className={color} />
      </div>
      <p className="text-xs font-black uppercase tracking-widest text-gray-400 mb-2">{title}</p>
      <div className={`text-5xl font-black ${color} mb-1 font-mono`}>
        {value}<span className="text-2xl ml-1 font-bold text-gray-400">{unit}</span>
      </div>
      <p className="text-sm text-gray-500 mt-4 leading-relaxed">{description}</p>
      
      {/* Scanner Effect */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-500 overflow-hidden">
        <div className="scanner-line" style={{ filter: 'hue-rotate(180deg)', opacity: 0.5 }}></div>
      </div>
    </div>
  </StaggerItem>
);

// ─── Feature Row ─────────────────────────────────────────────────────────
const FeatureRow = ({ icon: Icon, title, text, color }) => (
  <div className="flex gap-4 items-start group">
    <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${color}/10 border ${color}/20 group-hover:scale-110 transition-transform`}>
      <Icon size={18} className={color} />
    </div>
    <div>
      <h4 className="font-bold text-white text-sm mb-1">{title}</h4>
      <p className="text-gray-400 text-sm leading-relaxed">{text}</p>
    </div>
  </div>
);

// ─── Main Component ───────────────────────────────────────────────────────
const IoT = () => {
  const [activeTab, setActiveTab] = useState('nivel');
  const { scrollY } = useScroll();
  const yBg = useTransform(scrollY, [0, 1000], [0, 200]);
  const yHero = useTransform(scrollY, [0, 1000], [0, -100]);

  const sensors = {
    nivel: {
      icon: Droplets, title: 'Nível de Caixa d\'Água', value: '87', unit: '%',
      color: 'text-blue-400', bg: 'bg-[#0a1628] border-blue-500/20',
      description: 'Monitoramento ultrassônico do nível real da reserva hídrica. Alertas configuráveis por e-mail e push quando o nível atingir thresholds críticos.',
    },
    temperatura: {
      icon: Thermometer, title: 'Temperatura Ambiente', value: '24.3', unit: '°C',
      color: 'text-orange-400', bg: 'bg-[#160d05] border-orange-500/20',
      description: 'Sensores DS18B20 e DHT22 para temperatura e umidade em ambientes industriais, salas de servidores e câmaras frias. Histórico de até 5 anos.',
    },
    energia: {
      icon: Zap, title: 'Consumo Elétrico', value: '48.2', unit: 'kWh',
      color: 'text-yellow-400', bg: 'bg-[#131005] border-yellow-500/20',
      description: 'TCs de precisão + módulos PZEM medem corrente, tensão, fator de potência e demanda real. Geração de relatórios e alertas de sobrecarga.',
    },
  };

  const activeSensor = sensors[activeTab];

  return (
    <div className="w-full bg-[#030712] text-white overflow-hidden">
      <SEO
        title="Plataforma IoT Industrial | Teste Grátis 5 Equipamentos"
        description="Monitore suas máquinas em tempo real em Cuiabá e MT. Plataforma IoT industrial com teste grátis para até 5 equipamentos. Reduza paradas e aumente a eficiência em Mato Grosso."
        canonical="/iot"
        keywords="plataforma iot industrial mt, monitoramento remoto cuiabá, teste grátis iot máquinas, telemetria industrial cuiabá, indústria 4.0 mt"
      />

      {/* ── HERO ── */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
        {/* Grid bg */}
        <motion.div 
          style={{ y: yBg }}
          className="absolute inset-0"
          style={{
            backgroundImage: 'linear-gradient(rgba(6,182,212,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(6,182,212,0.04) 1px, transparent 1px)',
            backgroundSize: '60px 60px'
          }}>
        </motion.div>
        {/* Radial glow */}
        <motion.div style={{ y: yHero }} className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[600px] bg-cyan-500/5 blur-[120px] rounded-full pointer-events-none"></motion.div>
        <motion.div style={{ y: yBg }} className="absolute top-1/4 left-1/4 w-64 h-64 bg-blue-600/8 blur-[80px] rounded-full pointer-events-none"></motion.div>
        <motion.div style={{ y: yHero }} className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-purple-600/8 blur-[100px] rounded-full pointer-events-none"></motion.div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 py-24">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Left: Copy */}
            <FadeIn>
              <div className="space-y-8">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-cyan-500/10 border border-cyan-500/20 rounded-full">
                  <SignalDot color="bg-cyan-400" />
                  <span className="text-xs font-black uppercase tracking-widest text-cyan-400">IoT Industrial em Tempo Real</span>
                </div>

                <h1 className="text-5xl md:text-7xl lg:text-8xl font-black text-white mb-8 tracking-tighter leading-[0.95] uppercase drop-shadow-[0_4px_20px_rgba(0,0,0,0.9)]">
                  Conecte sua<br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400">
                    Indústria
                  </span><br />
                  ao Futuro
                </h1>

                <p className="text-slate-200 text-xl font-medium leading-relaxed max-w-xl drop-shadow-md">
                  Monitoramento inteligente de <strong className="text-white font-black underline decoration-cyan-500/50">nível de caixas d'água</strong>, <strong className="text-white font-black underline decoration-blue-500/50">temperatura</strong> e <strong className="text-white font-black underline decoration-purple-500/50">consumo elétrico</strong> — tudo centralizado na nossa plataforma IoT.
                </p>

                <div className="flex flex-col sm:flex-row gap-4">
                  <a
                    href="https://iotconects.com.br/"
                    target="_blank"
                    rel="noreferrer"
                    className="group flex items-center justify-center gap-3 px-8 py-4 bg-gradient-to-r from-gray-700 to-gray-900 border border-white/5 hover:border-white/20 text-white font-black uppercase tracking-widest text-xs rounded-xl transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
                  >
                    <ExternalLink size={16} className="group-hover:rotate-12 transition-transform" />
                    Acessar Plataforma
                  </a>
                  <a
                    href="https://thingsboard.cloud/dashboard/231a5800-ce96-11ef-852e-bd51c2b30fde?publicId=7aa99e80-8acd-11ef-a59e-a9c993dbec14"
                    target="_blank"
                    rel="noreferrer"
                    className="group flex items-center justify-center gap-3 px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-black uppercase tracking-widest text-xs rounded-xl transition-all duration-300 hover:shadow-[0_15px_40px_rgba(6,182,212,0.35)] hover:-translate-y-1"
                  >
                    <ExternalLink size={16} className="group-hover:rotate-12 transition-transform" />
                    Ver Plataforma Online
                  </a>
                  <Link
                    to="/entre-em-contato"
                    className="flex items-center justify-center gap-3 px-8 py-4 bg-white/5 border border-gray-700 hover:border-cyan-500/50 text-gray-300 hover:text-white font-bold text-xs rounded-xl transition-all duration-300"
                  >
                    Solicitar Demonstração <ChevronRight size={14} />
                  </Link>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-6 pt-6 border-t border-white/5">
                  {[
                    { n: 99, s: '.9%', label: 'Uptime' },
                    { n: 500, s: 'ms', label: 'Latência MQTT' },
                    { n: 24, s: '/7', label: 'Monitoramento' },
                  ].map((stat) => (
                    <div key={stat.label} className="text-center">
                      <div className="text-2xl font-black text-cyan-400 font-mono">
                        <Counter end={stat.n} suffix={stat.s} />
                      </div>
                      <div className="text-[10px] uppercase tracking-widest text-gray-500 mt-1">{stat.label}</div>
                    </div>
                  ))}
                </div>
              </div>
            </FadeIn>

            {/* Right: Live Dashboard Widget */}
            <FadeIn delay={0.2}>
              <div className="relative">
                {/* Dashboard Card */}
                <div className="bg-[#0a0f1a]/80 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden shadow-2xl">
                  {/* Title bar */}
                  <div className="flex items-center justify-between px-6 py-4 border-b border-white/5 bg-white/2">
                    <div className="flex items-center gap-3">
                      <div className="flex gap-1.5">
                        <div className="w-3 h-3 rounded-full bg-red-500/70"></div>
                        <div className="w-3 h-3 rounded-full bg-yellow-500/70"></div>
                        <div className="w-3 h-3 rounded-full bg-green-500/70"></div>
                      </div>
                      <span className="text-xs text-gray-500 font-mono">iotconects.com.br — Dashboard</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <SignalDot color="bg-green-400" delay="0.5s" />
                      <span className="text-[10px] text-green-400 font-mono">3 devices online</span>
                    </div>
                  </div>

                  {/* Tabs */}
                  <div className="flex border-b border-white/5">
                    {Object.entries({ nivel: 'Nível', temperatura: 'Temp.', energia: 'Energia' }).map(([key, label]) => (
                      <button
                        key={key}
                        onClick={() => setActiveTab(key)}
                        className={`flex-1 px-4 py-3 text-xs font-bold uppercase tracking-widest transition-all ${activeTab === key ? 'text-cyan-400 border-b-2 border-cyan-400 bg-cyan-500/5' : 'text-gray-500 hover:text-gray-300'}`}
                      >
                        {label}
                      </button>
                    ))}
                  </div>

                  {/* Sensor display */}
                  <div className="p-8 space-y-6">
                    <div className="flex items-center gap-4">
                      <div className={`w-16 h-16 rounded-2xl flex items-center justify-center ${activeSensor.color.replace('text-', 'bg-')}/10 border ${activeSensor.color.replace('text-', 'border-')}/20`}>
                        <activeSensor.icon size={30} className={activeSensor.color} />
                      </div>
                      <div>
                        <p className="text-[10px] uppercase tracking-widest text-gray-500 mb-1">{activeSensor.title}</p>
                        <div className={`text-5xl font-black font-mono ${activeSensor.color}`}>
                          {activeSensor.value}
                          <span className="text-2xl text-gray-500 ml-1">{activeSensor.unit}</span>
                        </div>
                      </div>
                    </div>

                    {/* Bar */}
                    <div className="space-y-2">
                      <div className="flex justify-between text-[10px] text-gray-500">
                        <span>0</span><span>Limite crítico: 20%</span><span>100%</span>
                      </div>
                      <div className="h-3 bg-white/5 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-1000 ${activeSensor.color.replace('text-', 'bg-')}`}
                          style={{ width: `${parseFloat(activeSensor.value)}%` }}
                        ></div>
                      </div>
                    </div>

                    {/* Mini chart mock */}
                    <div className="space-y-1">
                      <p className="text-[10px] uppercase tracking-widest text-gray-500">Histórico 24h</p>
                      <div className="flex items-end gap-1 h-16">
                        {[60, 72, 65, 80, 78, 85, 87, 82, 75, 80, 84, 87].map((h, i) => (
                          <div
                            key={i}
                            className={`flex-1 rounded-sm ${activeSensor.color.replace('text-', 'bg-')}/40 hover:${activeSensor.color.replace('text-', 'bg-')}/80 transition-all`}
                            style={{ height: `${h}%` }}
                          ></div>
                        ))}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 pt-2 border-t border-white/5">
                      <Activity size={12} className="text-green-400" />
                      <span className="text-[10px] text-gray-500 font-mono">Última leitura: agora mesmo — MQTT topic OK</span>
                    </div>
                  </div>
                </div>

                {/* Floating badges */}
                <div className="absolute -top-4 -right-4 bg-green-500 text-white text-[10px] font-black px-3 py-1.5 rounded-full shadow-lg shadow-green-500/30 uppercase tracking-widest">
                  ● LIVE
                </div>
                <div className="absolute -bottom-4 -left-4 bg-[#0a1628] border border-cyan-500/30 text-cyan-400 text-[10px] font-mono px-4 py-2 rounded-xl shadow-xl">
                  MQTT broker: broker.iotconects.com.br
                </div>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* Divisor Técnico */}
      <div className="relative h-16 bg-[#030712] overflow-hidden">
        <svg className="absolute bottom-0 w-full h-16 text-[#050d1a] fill-current" preserveAspectRatio="none" viewBox="0 0 1440 54">
          <path d="M0 54L120 45C240 36 480 18 720 18C960 18 1200 36 1320 45L1440 54V0H1320C1200 0 960 0 720 0C480 0 240 0 120 0H0V54Z"></path>
        </svg>
      </div>

      {/* ── SOLUÇÕES IoT ── */}
      <section className="py-32 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-blue-950/5 to-transparent pointer-events-none"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeIn>
            <div className="text-center mb-20">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500/10 border border-blue-500/20 rounded-full mb-6">
                <MonitorDot size={14} className="text-blue-400" />
                <span className="text-xs font-black uppercase tracking-widest text-blue-400">Soluções de Monitoramento</span>
              </div>
              <h2 className="text-4xl md:text-5xl font-black mb-6">
                Sensores para Cada<br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">Necessidade Industrial</span>
              </h2>
              <p className="text-gray-400 max-w-2xl mx-auto text-lg leading-relaxed">
                Hardware robusto + software inteligente. Cada sensor comunica via MQTT em tempo real com nossa plataforma ThingsBoard, gerando alertas e relatórios automáticos.
              </p>
            </div>
          </FadeIn>

          <StaggerContainer className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <SensorCard
              icon={Droplets} title="Nível de Caixa d'Água" value="87" unit="%"
              color="text-blue-400" bg="bg-[#050d1a] border border-blue-500/15"
              description="Sensor ultrassônico JSN-SR04T mede o nível real a cada 30 segundos. Alertas automáticos quando a reserva atingir nível crítico. Ideal para condomínios, indústrias e propriedades rurais."
            />
            <SensorCard
              icon={Thermometer} title="Temperatura e Umidade" value="24.3" unit="°C"
              color="text-orange-400" bg="bg-[#120a03] border border-orange-500/15"
              description="DS18B20 para temperatura precisa (-55°C a +125°C) e DHT22 para humidade relativa. Monitoramento de salas de servidores, câmaras frias e ambientes industriais com controladores de setpoint."
            />
            <SensorCard
              icon={Zap} title="Consumo Elétrico" value="48.2" unit="kWh"
              color="text-yellow-400" bg="bg-[#120f03] border border-yellow-500/15"
              description="Módulo PZEM-004T mede tensão (0–300V AC), corrente (0–100A), potência ativa, fator de potência e energia acumulada. Dashboard de custos e relatório mensal automático em PDF."
            />
          </StaggerContainer>
        </div>
      </section>

      {/* ── MQTT BROKER ── */}
      <section className="py-32 relative">
        <div className="absolute inset-0">
          <div className="absolute inset-0" style={{
            backgroundImage: 'radial-gradient(ellipse at 20% 50%, rgba(139,92,246,0.05) 0%, transparent 60%), radial-gradient(ellipse at 80% 50%, rgba(6,182,212,0.05) 0%, transparent 60%)'
          }}></div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            {/* Left: Broker visual */}
            <FadeIn>
              <div className="relative">
                <div className="bg-[#080d18] border border-purple-500/20 rounded-2xl p-8 font-mono text-sm shadow-2xl">
                  {/* Terminal header */}
                  <div className="flex items-center gap-2 mb-6 pb-4 border-b border-white/5">
                    <div className="flex gap-1.5">
                      <div className="w-3 h-3 rounded-full bg-red-500/70"></div>
                      <div className="w-3 h-3 rounded-full bg-yellow-500/70"></div>
                      <div className="w-3 h-3 rounded-full bg-green-500/70"></div>
                    </div>
                    <span className="text-gray-500 text-xs ml-2">mosquitto — MQTT Broker v2.0</span>
                    <span className="ml-auto flex items-center gap-2">
                      <SignalDot color="bg-green-400" />
                      <span className="text-[10px] text-green-400">RUNNING</span>
                    </span>
                  </div>

                  <div className="space-y-3 text-xs">
                    {[
                      { color: 'text-green-400', text: '1747500001: New connection from 192.168.1.45 on port 8883.' },
                      { color: 'text-cyan-400', text: '1747500001: Client esp32-sensor-01 connected (p2, c1, k60).' },
                      { color: 'text-gray-300', text: '1747500003: Client esp32-sensor-01 — topic: gca/nivel/cisterna1' },
                      { color: 'text-yellow-400', text: '→ Payload: {"nivel":87,"timestamp":1747500003}' },
                      { color: 'text-gray-300', text: '1747500005: Client esp32-sensor-02 — topic: gca/temp/sala-servidores' },
                      { color: 'text-orange-400', text: '→ Payload: {"temp":24.3,"umidade":65.1}' },
                      { color: 'text-gray-300', text: '1747500008: Client pzem-energy-01 — topic: gca/energia/quadro-geral' },
                      { color: 'text-yellow-400', text: '→ Payload: {"kwh":48.2,"v":220.1,"a":21.9,"pf":0.97}' },
                      { color: 'text-purple-400', text: '1747500010: ThingsBoard subscribed to gca/+/# — forwarding data.' },
                    ].map((line, i) => (
                      <div key={i} className={`${line.color} leading-relaxed`}>
                        <span>{line.text}</span>
                      </div>
                    ))}
                    <div className="flex items-center gap-1 text-green-400">
                      <span>$</span>
                      <span className="animate-pulse">█</span>
                    </div>
                  </div>
                </div>

                {/* Connection cards */}
                <div className="absolute -right-6 top-8 space-y-3">
                  {[
                    { label: 'ESP32', color: 'bg-blue-500' },
                    { label: 'ThingsBoard', color: 'bg-purple-500' },
                    { label: 'Dashboard', color: 'bg-green-500' },
                  ].map((item) => (
                    <div key={item.label} className={`${item.color}/10 border ${item.color.replace('bg-', 'border-')}/30 text-white text-[10px] font-bold px-3 py-2 rounded-lg backdrop-blur-sm`}>
                      {item.label}
                    </div>
                  ))}
                </div>
              </div>
            </FadeIn>

            {/* Right: Copy */}
            <FadeIn delay={0.2}>
              <div className="space-y-8">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-purple-500/10 border border-purple-500/20 rounded-full">
                  <Radio size={14} className="text-purple-400" />
                  <span className="text-xs font-black uppercase tracking-widest text-purple-400">Broker MQTT Próprio</span>
                </div>

                <h2 className="text-4xl md:text-5xl font-black leading-tight">
                  Infraestrutura<br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">Totalmente Sua</span>
                </h2>

                <p className="text-gray-400 leading-relaxed text-lg">
                  Nosso servidor Mosquitto MQTT está hospedado em infraestrutura dedicada com TLS/SSL obrigatório, autenticação por certificado e QoS configurável. <strong className="text-white">Seus dados nunca passam por terceiros.</strong>
                </p>

                <div className="space-y-5">
                  {[
                    { icon: Shield, color: 'text-purple-400', title: 'TLS/SSL + Autenticação ACL', text: 'Comunicação 100% criptografada na porta 8883. Controle granular de permissões por cliente/tópico.' },
                    { icon: Activity, color: 'text-cyan-400', title: 'QoS 0, 1 e 2 disponíveis', text: 'Escolha entre "best effort", "at least once" ou "exactly once" conforme criticidade do dado.' },
                    { icon: Server, color: 'text-blue-400', title: 'Alta disponibilidade', text: 'Infra redundante com monitoramento 24/7, SLA 99.9% e backup automático de configurações.' },
                    { icon: Database, color: 'text-green-400', title: 'Retenção e persistência', text: 'Mensagens retidas por tópico garantem que novos subscribers recebam o último estado do sensor.' },
                  ].map((f) => (
                    <FeatureRow key={f.title} {...f} />
                  ))}
                </div>

                <div className="bg-[#0a0f1a] border border-white/5 rounded-xl p-5 font-mono text-sm space-y-1">
                  <p className="text-gray-500 text-xs mb-3">// Configuração do device ESP32</p>
                  <p><span className="text-purple-400">const char*</span> <span className="text-cyan-400">mqtt_server</span> = <span className="text-green-400">"broker.iotconects.com.br"</span>;</p>
                  <p><span className="text-purple-400">const int</span> <span className="text-cyan-400">mqtt_port</span> = <span className="text-yellow-400">8883</span>;</p>
                  <p><span className="text-purple-400">const char*</span> <span className="text-cyan-400">topic</span> = <span className="text-green-400">"gca/nivel/cisterna1"</span>;</p>
                </div>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* ── THINGSBOARD ── */}
      <section className="py-32 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#040c1a] to-[#030712]"></div>
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyan-500/30 to-transparent"></div>
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyan-500/30 to-transparent"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            {/* Left: Copy */}
            <FadeIn>
              <div className="space-y-8">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-cyan-500/10 border border-cyan-500/20 rounded-full">
                  <BarChart3 size={14} className="text-cyan-400" />
                  <span className="text-xs font-black uppercase tracking-widest text-cyan-400">Plataforma ThingsBoard</span>
                </div>

                <h2 className="text-4xl md:text-5xl font-black leading-tight">
                  Dashboards<br />de Nível
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400"> Enterprise</span>
                </h2>

                <p className="text-gray-400 leading-relaxed text-lg">
                  Utilizamos o <strong className="text-white">ThingsBoard</strong> — plataforma open-source líder global em IoT — para centralizar todos os dados, criar dashboards customizados e configurar alertas avançados. Acesse tudo pelo endereço:
                </p>

                <a
                  href="https://iotconects.com.br/"
                  target="_blank"
                  rel="noreferrer"
                  className="group inline-flex items-center gap-3 px-6 py-4 bg-[#0a1628] border border-cyan-500/30 hover:border-cyan-500 rounded-xl transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_10px_30px_rgba(6,182,212,0.15)]"
                >
                  <Globe size={20} className="text-cyan-400" />
                  <div>
                    <p className="text-[10px] text-gray-500 uppercase tracking-widest">Plataforma IoT</p>
                    <p className="text-cyan-300 font-bold font-mono">iotconects.com.br</p>
                  </div>
                  <ExternalLink size={16} className="text-gray-500 group-hover:text-cyan-400 transition-colors ml-auto" />
                </a>

                <div className="grid grid-cols-2 gap-4">
                  {[
                    { icon: Bell, color: 'text-red-400', title: 'Alertas em Tempo Real', text: 'E-mail, SMS e push notification quando sensores ultrapassam thresholds.' },
                    { icon: BarChart3, color: 'text-cyan-400', title: 'Gráficos & Relatórios', text: 'Tendências históricas, análise de correlação e relatórios em PDF automáticos.' },
                    { icon: Wifi, color: 'text-blue-400', title: 'Multi-Protocol', text: 'MQTT, HTTP, CoAP, WebSockets — integra com qualquer dispositivo.' },
                    { icon: Cloud, color: 'text-purple-400', title: 'Acesso em Qualquer Lugar', text: 'Dashboard responsivo acessível do navegador, tablet ou smartphone.' },
                  ].map((item) => (
                    <div key={item.title} className="bg-[#0a0f1a] border border-white/5 rounded-xl p-5 hover:border-white/15 transition-all">
                      <item.icon size={20} className={`${item.color} mb-3`} />
                      <h4 className="text-white font-bold text-sm mb-1">{item.title}</h4>
                      <p className="text-gray-500 text-xs leading-relaxed">{item.text}</p>
                    </div>
                  ))}
                </div>
              </div>
            </FadeIn>

            {/* Right: ThingsBoard dashboard mockup */}
            <FadeIn delay={0.2}>
              <div className="relative">
                <div className="bg-[#06101f] border border-cyan-500/15 rounded-2xl overflow-hidden shadow-[0_0_80px_rgba(6,182,212,0.08)]">
                  {/* Topbar */}
                  <div className="bg-[#040d1a] border-b border-white/5 px-6 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center">
                        <Cpu size={16} className="text-white" />
                      </div>
                      <div>
                        <p className="text-white font-bold text-sm">GCA IoT — Dashboard</p>
                        <p className="text-gray-500 text-[10px] font-mono">iotconects.com.br</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <SignalDot color="bg-green-400" delay="0.5s" />
                      <span className="text-[10px] text-green-400 font-mono">3 devices online</span>
                    </div>
                  </div>

                  {/* Widget grid */}
                  <div className="p-6 grid grid-cols-3 gap-4">
                    {/* KPIs */}
                    {[
                      { label: 'Nível', val: '87%', color: 'text-blue-400', icon: Droplets },
                      { label: 'Temperatura', val: '24.3°C', color: 'text-orange-400', icon: Thermometer },
                      { label: 'Consumo', val: '48.2kWh', color: 'text-yellow-400', icon: Zap },
                    ].map((kpi) => (
                      <div key={kpi.label} className="bg-white/2 border border-white/5 rounded-xl p-4">
                        <kpi.icon size={14} className={`${kpi.color} mb-2`} />
                        <div className={`text-xl font-black font-mono ${kpi.color}`}>{kpi.val}</div>
                        <div className="text-[9px] text-gray-500 uppercase tracking-widest mt-1">{kpi.label}</div>
                      </div>
                    ))}

                    {/* Chart */}
                    <div className="col-span-2 bg-white/2 border border-white/5 rounded-xl p-4">
                      <p className="text-[10px] text-gray-500 uppercase tracking-widest mb-3">Nível — Últimas 12h</p>
                      <div className="flex items-end gap-1 h-20">
                        {[45, 50, 60, 72, 75, 80, 82, 85, 87, 84, 85, 87].map((h, i) => (
                          <div key={i} className="flex-1 bg-blue-500/40 rounded-sm hover:bg-blue-500/70 transition-all" style={{ height: `${h}%` }}></div>
                        ))}
                      </div>
                    </div>

                    {/* Alerts */}
                    <div className="bg-white/2 border border-white/5 rounded-xl p-4">
                      <p className="text-[10px] text-gray-500 uppercase tracking-widest mb-3">Alertas</p>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2"><div className="w-2 h-2 bg-green-400 rounded-full"></div><span className="text-[10px] text-green-400">Nível OK</span></div>
                        <div className="flex items-center gap-2"><div className="w-2 h-2 bg-green-400 rounded-full"></div><span className="text-[10px] text-green-400">Temp OK</span></div>
                        <div className="flex items-center gap-2"><div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></div><span className="text-[10px] text-yellow-400">Energia ↑</span></div>
                      </div>
                    </div>

                    {/* Energy chart */}
                    <div className="col-span-3 bg-white/2 border border-white/5 rounded-xl p-4">
                      <p className="text-[10px] text-gray-500 uppercase tracking-widest mb-3">Consumo kWh — Semana</p>
                      <div className="flex items-end gap-2 h-14">
                        {['Seg','Ter','Qua','Qui','Sex','Sáb','Dom'].map((d, i) => (
                          <div key={d} className="flex-1 flex flex-col items-center gap-1">
                            <div className="w-full bg-yellow-400/40 rounded-sm" style={{ height: `${[50, 70, 65, 80, 75, 40, 30][i]}%` }}></div>
                            <span className="text-[8px] text-gray-600">{d}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Glow effect */}
                <div className="absolute -inset-4 bg-cyan-500/3 blur-[40px] rounded-3xl -z-10"></div>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* ── COMO FUNCIONA ── */}
      <section className="py-32 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeIn>
            <div className="text-center mb-20">
              <h2 className="text-4xl md:text-5xl font-black mb-6">
                Como <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400">Funciona</span>
              </h2>
              <p className="text-gray-400 max-w-xl mx-auto">Do sensor ao dashboard em 4 etapas simples. Instalamos, configuramos e entregamos tudo funcionando.</p>
            </div>
          </FadeIn>

          <StaggerContainer className="grid grid-cols-1 md:grid-cols-4 gap-8 relative">
            {/* Connector line */}
            <div className="absolute top-12 left-[12.5%] right-[12.5%] h-px bg-gradient-to-r from-cyan-500/20 via-purple-500/20 to-cyan-500/20 hidden md:block"></div>

            {[
              { n: '01', icon: Cpu, color: 'text-cyan-400', bg: 'bg-cyan-500/10 border-cyan-500/20', title: 'Instalação Hardware', text: 'Instalamos ESP32/ESP8266 com os sensores físicos no local — caixa d\'água, painel elétrico, ambiente.' },
              { n: '02', icon: Radio, color: 'text-purple-400', bg: 'bg-purple-500/10 border-purple-500/20', title: 'Conexão MQTT', text: 'O device publica dados no nosso Broker MQTT via WiFi com TLS. Latência < 500ms.' },
              { n: '03', icon: Database, color: 'text-blue-400', bg: 'bg-blue-500/10 border-blue-500/20', title: 'Processamento', text: 'ThingsBoard consome o MQTT, armazena historicamente e aciona regras de alerta.' },
              { n: '04', icon: BarChart3, color: 'text-green-400', bg: 'bg-green-500/10 border-green-500/20', title: 'Dashboard & Alertas', text: 'Você acessa o dashboard em iotconects.com.br e recebe notificações em tempo real.' },
            ].map((step) => (
              <StaggerItem key={step.n}>
                <div className="text-center space-y-4 relative">
                  <div className={`w-20 h-20 mx-auto rounded-2xl border flex items-center justify-center relative ${step.bg}`}>
                    <step.icon size={28} className={step.color} />
                    <span className={`absolute -top-2 -right-2 text-[10px] font-black ${step.color} bg-[#030712] border border-current rounded-full w-6 h-6 flex items-center justify-center`}>{step.n}</span>
                  </div>
                  <h3 className="font-black text-white">{step.title}</h3>
                  <p className="text-gray-500 text-sm leading-relaxed">{step.text}</p>
                </div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* ── CTA FINAL ── */}
      <section className="py-32 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-cyan-950/10"></div>
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyan-500/30 to-transparent"></div>
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-[600px] h-[400px] bg-cyan-500/5 blur-[100px] rounded-full"></div>
        </div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <FadeIn>
            <div className="space-y-8">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-cyan-500/10 border border-cyan-500/20 rounded-full">
                <CheckCircle size={14} className="text-cyan-400" />
                <span className="text-xs font-black uppercase tracking-widest text-cyan-400">Pronto para conectar sua planta?</span>
              </div>

              <h2 className="text-5xl md:text-6xl font-black leading-tight">
                Sua indústria<br />monitorada em<br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400">tempo real</span>
              </h2>

              <p className="text-gray-400 text-lg max-w-2xl mx-auto leading-relaxed">
                Entre em contato para uma demonstração gratuita. Nossa equipe visita sua planta, identifica os pontos de monitoramento e apresenta o projeto completo sem compromisso.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a
                  href="https://iotconects.com.br/"
                  target="_blank"
                  rel="noreferrer"
                  className="group flex items-center justify-center gap-3 px-10 py-5 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-black uppercase tracking-widest text-sm rounded-xl transition-all duration-300 hover:shadow-[0_20px_50px_rgba(6,182,212,0.4)] hover:-translate-y-1"
                >
                  <ExternalLink size={18} />
                  Acessar iotconects.com.br
                </a>
                <Link
                  to="/entre-em-contato"
                  className="group flex items-center justify-center gap-3 px-10 py-5 bg-transparent border border-gray-700 hover:border-cyan-500/50 text-gray-300 hover:text-white font-bold text-sm rounded-xl transition-all duration-300"
                >
                  Falar com um Especialista <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>
    </div>
  );
};

export default IoT;
