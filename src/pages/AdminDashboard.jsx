import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAdminStore } from '../store/adminStore';
import Skeleton from '../components/ui/Skeleton';
import RichTextEditor from '../components/ui/RichTextEditor';
import SEOPanel from '../components/ui/SEOPanel';
import { FadeIn, StaggerContainer, StaggerItem } from '../components/ui/AnimWrapper';
import { LogOut, UploadCloud, FolderPlus, Trash2, Database, BarChart3, LayoutDashboard, Image as ImageIcon, Link2, X, Globe, Edit, ChevronDown, ChevronUp, Newspaper, Plus, Calendar, User, Type, Mail, CheckCheck, Eye, ShieldCheck, KeyRound, UserPlus, Phone } from 'lucide-react';

const AdminDashboard = () => {
    const navigate = useNavigate();
    const { 
        isAuthenticated, isAuthLoading, isInitialLoading, logout, marcas, siteMedia, blogPosts, siteContent, leads,
        adicionarMarca, removerMarca, adicionarManual, editarManual, removerManual, atualizarMedia,
        adicionarPost, editarPost, removerPost, atualizarConteudo, atualizarArrayConteudo,
        removerLead, marcarLeadLido, marcarTodosLidos, uploadFileToStorage,
        admins, changePassword, createNewAdmin, deleteAdmin, resetAdminPassword, adminEmail
    } = useAdminStore();
    
    // States gerais
    const [activeTab, setActiveTab] = useState('manuais');
    const [activeTextSection, setActiveTextSection] = useState('global');
    const [uploadingKeys, setUploadingKeys] = useState({});
    
    // States de Formulario de Marca
    const [novaMarcaLoading, setNovaMarcaLoading] = useState(false);
    const [novaMarcaInput, setNovaMarcaInput] = useState('');

    // States do Modal de Upload de Manual
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedMarca, setSelectedMarca] = useState(null);
    const [manualTitle, setManualTitle] = useState('');
    const [manualLink, setManualLink] = useState('');
    const [saveSuccess, setSaveSuccess] = useState(false);
    const [expandedMarcaId, setExpandedMarcaId] = useState(null);
    const [editingManualId, setEditingManualId] = useState(null);

    // States do Blog
    const [isBlogModalOpen, setIsBlogModalOpen] = useState(false);
    const [editingPostId, setEditingPostId] = useState(null);
    const [postTitle, setPostTitle] = useState('');
    const [postResumo, setPostResumo] = useState('');
    const [postConteudo, setPostConteudo] = useState('');
    const [postImage, setPostImage] = useState('');
    const [postAutor, setPostAutor] = useState('GCA Equipe');
    const [postData, setPostData] = useState(new Date().toISOString().slice(0, 16));

    // States de Segurança
    const [newPass, setNewPass] = useState('');
    const [newPassLoading, setNewPassLoading] = useState(false);
    const [adminForm, setAdminForm] = useState({ name: '', email: '', password: '' });
    const [adminFormLoading, setAdminFormLoading] = useState(false);
    // States de Leads
    const [isLeadModalOpen, setIsLeadModalOpen] = useState(false);
    const [selectedLead, setSelectedLead] = useState(null);

    // Cálculos do Dashboard de Leads
    const leadStats = useMemo(() => {
        if (!leads || leads.length === 0) return null;

        const now = new Date();
        const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        
        const unread = leads.filter(l => !l.lido).length;
        const last7Days = leads.filter(l => new Date(l.data) >= sevenDaysAgo).length;
        
        // Distribuição por Assunto
        const subjects = {};
        leads.forEach(l => {
            const s = l.subject || 'Sem Assunto';
            subjects[s] = (subjects[s] || 0) + 1;
        });
        const topSubjects = Object.entries(subjects)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 3);

        // Atividade Diária (últimos 7 dias)
        const daily = [];
        for (let i = 6; i >= 0; i--) {
            const date = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
            const dateStr = date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });
            const count = leads.filter(l => {
                const lDate = new Date(l.data);
                return lDate.getDate() === date.getDate() && lDate.getMonth() === date.getMonth();
            }).length;
            daily.push({ label: dateStr, value: count });
        }

        return { unread, total: leads.length, last7Days, topSubjects, daily };
    }, [leads]);

    useEffect(() => {
        if (!isAuthenticated && !isAuthLoading) {
            navigate('/admin');
        }
    }, [isAuthenticated, isAuthLoading, navigate]);

    if (isAuthLoading) return (
        <div className="min-h-screen bg-[#0a0f18] flex items-center justify-center">
            <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        </div>
    );

    if (!isAuthenticated) return null;

    // Handlers Manuais
    const handleAdicionarMarca = (e) => {
        e.preventDefault();
        if(!novaMarcaInput.trim()) return;
        setNovaMarcaLoading(true);
        setTimeout(() => {
            adicionarMarca(novaMarcaInput);
            setNovaMarcaInput('');
            setNovaMarcaLoading(false);
        }, 600);
    };

    const openUploadModal = (marca, manual = null) => {
        setSelectedMarca(marca);
        if (manual) {
            setManualTitle(manual.titulo);
            setManualLink(manual.link);
            setEditingManualId(manual.id);
        } else {
            setManualTitle('');
            setManualLink('');
            setEditingManualId(null);
        }
        setIsModalOpen(true);
    };

    const handleSaveManual = (e) => {
        e.preventDefault();
        if(!manualTitle || !manualLink) return;
        
        if (editingManualId) {
            editarManual(selectedMarca.id, editingManualId, manualTitle, manualLink);
        } else {
            adicionarManual(selectedMarca.id, manualTitle, manualLink);
        }
        
        setSaveSuccess(true);
        setTimeout(() => {
            setSaveSuccess(false);
            setIsModalOpen(false);
        }, 1000);
    };

    // Handlers Blog
    const openBlogModal = (post = null) => {
        if (post) {
            setPostTitle(post.titulo);
            setPostResumo(post.resumo);
            setPostConteudo(post.conteudo);
            setPostImage(post.imageUrl);
            setPostAutor(post.autor || 'GCA Equipe');
            setPostData(new Date(post.data).toISOString().slice(0, 16));
            setEditingPostId(post.id);
        } else {
            setPostTitle('');
            setPostResumo('');
            setPostConteudo('');
            setPostImage('');
            setPostAutor('GCA Equipe');
            setPostData(new Date().toISOString().slice(0, 16));
            setEditingPostId(null);
        }
        setIsBlogModalOpen(true);
    };

    const handleSavePost = (e) => {
        e.preventDefault();
        const postPayload = {
            titulo: postTitle,
            resumo: postResumo,
            conteudo: postConteudo,
            imageUrl: postImage,
            autor: postAutor,
            data: new Date(postData).toISOString()
        };

        if (editingPostId) {
            editarPost(editingPostId, postPayload);
        } else {
            adicionarPost(postPayload);
        }
        
        setIsBlogModalOpen(false);
    };

    // Handlers Leads
    const openLeadModal = (lead) => {
        setSelectedLead(lead);
        setIsLeadModalOpen(true);
        if (!lead.lido) {
            marcarLeadLido(lead.id);
        }
    };

    const toggleMarcaExpand = (id) => {
        setExpandedMarcaId(prev => prev === id ? null : id);
    };

    const handlePasswordChange = async (e) => {
        e.preventDefault();
        setNewPassLoading(true);
        try {
            await changePassword(newPass);
            alert('Senha alterada com sucesso! Use a nova senha no próximo login.');
            setNewPass('');
        } catch (err) {
            alert('Erro ao alterar senha. Talvez seja necessário deslogar e logar novamente por segurança.');
            console.error(err);
        } finally {
            setNewPassLoading(false);
        }
    };

    const handleCreateAdmin = async (e) => {
        e.preventDefault();
        setAdminFormLoading(true);
        try {
            await createNewAdmin(adminForm.email, adminForm.password, adminForm.name);
            alert('Novo administrador registrado com sucesso na nuvem!');
            setAdminForm({ name: '', email: '', password: '' });
        } catch (err) {
            alert('Falha ao criar administrador. Verifique as regras do Supabase.');
            console.error(err);
        } finally {
            setAdminFormLoading(false);
        }
    };

    const handleDeleteAdmin = async (id, name) => {
        if(window.confirm(`ATENÇÃO: Você tem certeza que deseja EXCLUIR PERMANENTEMENTE o usuário "${name}"?`)) {
            try {
                await deleteAdmin(id);
                alert('Usuário apagado com sucesso.');
            } catch (error) {
                alert('Erro ao apagar: ' + error.message);
                console.error(error);
            }
        }
    };

    const handleResetAdminPassword = async (id, name) => {
        const newPass = window.prompt(`Digite a nova senha para o usuário "${name}" (mínimo 6 caracteres):`);
        if (newPass === null) return; // cancelado
        if (newPass.length < 6) {
            alert('A senha deve ter pelo menos 6 caracteres.');
            return;
        }
        try {
            await resetAdminPassword(id, newPass);
            alert('Senha redefinida com sucesso!');
        } catch (error) {
            alert('Erro ao redefinir: ' + error.message);
            console.error(error);
        }
    };

    const handleFileUpload = async (e, chave, type, pathFolder = 'uploads') => {
        const file = e.target.files[0];
        if (!file) return;

        setUploadingKeys(prev => ({ ...prev, [chave]: true }));
        try {
            const downloadUrl = await uploadFileToStorage(file, pathFolder);
            if(type === 'media') {
                 atualizarMedia(chave, 'url', downloadUrl);
            } else if (type === 'favicon') {
                 atualizarMedia('favicon', 'url', downloadUrl);
            }
        } catch (error) {
            console.error('Erro no upload:', error);
            alert('Falha ao enviar arquivo. Verifique sua conexão ou regras do Supabase.');
        } finally {
            setUploadingKeys(prev => ({ ...prev, [chave]: false }));
        }
    };

    const handleModalFileUpload = async (e, type) => {
        const file = e.target.files[0];
        if (!file) return;

        if (type === 'manual') {
            setUploadingKeys(prev => ({ ...prev, manualRef: true }));
            try {
                const downloadUrl = await uploadFileToStorage(file, 'manuais');
                setManualLink(downloadUrl);
                if (!manualTitle) setManualTitle(file.name.replace(/\.[^/.]+$/, ""));
            } catch (error) {
                console.error(error);
                alert('Falha ao subir documento PDF.');
            } finally {
                setUploadingKeys(prev => ({ ...prev, manualRef: false }));
            }
        } else if (type === 'blog') {
            setUploadingKeys(prev => ({ ...prev, blogRef: true }));
            try {
                const downloadUrl = await uploadFileToStorage(file, 'blog');
                setPostImage(downloadUrl);
            } catch (error) {
                console.error(error);
                alert('Falha ao subir imagem do blog.');
            } finally {
                setUploadingKeys(prev => ({ ...prev, blogRef: false }));
            }
        }
    };

    const totalManuais = marcas.reduce((acc, curr) => acc + (Array.isArray(curr.manuais) ? curr.manuais.length : 0), 0);
    const unreadLeadsCount = (leads || []).filter(l => !l.lido).length;

    const renderMediaInput = (label, chave, placeholderImg = '') => (
        <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100 space-y-4">
            <h4 className="font-bold text-gray-900 border-l-4 border-primary pl-3 mb-4">{label}</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                    <div className="flex items-center justify-between">
                        <label className="text-[10px] font-black uppercase text-gray-400 tracking-wider">URL da Imagem</label>
                        <div className="relative overflow-hidden cursor-pointer">
                            <span className="text-[10px] font-bold text-primary flex items-center gap-1 cursor-pointer hover:underline">
                                {uploadingKeys[chave] ? 'Enviando...' : <><UploadCloud size={12}/> Enviar do PC</>}
                            </span>
                            <input 
                                type="file" 
                                accept="image/*"
                                disabled={uploadingKeys[chave]}
                                onChange={(e) => handleFileUpload(e, chave, 'media', 'banners')}
                                className="absolute inset-0 opacity-0 cursor-pointer disabled:cursor-not-allowed" 
                            />
                        </div>
                    </div>
                    <div className="relative">
                        <ImageIcon className="absolute left-3 top-3 text-gray-400" size={16} />
                        <input 
                            type="url" 
                            placeholder="https://exemplo.com/foto.jpg"
                            value={siteMedia[chave]?.url || ''} 
                            onChange={(e) => atualizarMedia(chave, 'url', e.target.value)}
                            disabled={uploadingKeys[chave]}
                            className={`w-full pl-10 pr-4 py-2 border rounded-lg outline-none text-sm transition-all ${uploadingKeys[chave] ? 'bg-gray-100 border-gray-200 text-gray-400' : 'bg-white border-gray-200 focus:ring-2 focus:ring-primary/20'}`} />
                    </div>
                </div>
                <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase text-gray-400 tracking-wider">Link de Destino (Clique)</label>
                    <div className="relative">
                        <Link2 className="absolute left-3 top-3 text-gray-400" size={16} />
                        <input 
                            type="text" 
                            placeholder="Ex: /servicos ou https://google.com"
                            value={siteMedia[chave]?.link || ''} 
                            onChange={(e) => atualizarMedia(chave, 'link', e.target.value)}
                            className="w-full pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 outline-none text-sm transition-all" />
                    </div>
                </div>
            </div>
            {siteMedia[chave]?.url && (
                <div className="mt-2 w-full h-24 rounded-lg bg-cover bg-center border border-gray-200 shadow-inner relative" 
                     style={{ backgroundImage: `url(${siteMedia[chave].url})` }}>
                     {uploadingKeys[chave] && <div className="absolute inset-0 bg-black/50 flex items-center justify-center rounded-lg"><span className="text-white text-xs font-bold animate-pulse">Carregando...</span></div>}
                </div>
            )}
        </div>
    );

    return (
        <div className="min-h-screen bg-[#f3f4f6] flex flex-col md:flex-row relative">
            
            {/* Modal de Upload de Links PDF */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <FadeIn delay={0}>
                        <div className="bg-white rounded-3xl w-full max-w-md overflow-hidden shadow-2xl">
                            <div className="bg-gray-50 border-b border-gray-100 p-6 flex justify-between items-center">
                                <div>
                                   <h3 className="font-black text-gray-900 text-lg">{editingManualId ? 'Editar Arquivo / Manual' : 'Vincular Novo Documento'}</h3>
                                   <p className="text-gray-500 text-sm">Na pasta de: <strong className="text-primary">{selectedMarca?.nome}</strong></p>
                                </div>
                                <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-900 transition-colors bg-white p-2 border border-gray-200 rounded-full shadow-sm"><X size={20}/></button>
                            </div>
                            <form onSubmit={handleSaveManual} className="p-6 space-y-4">
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2">Nome do Manual / Arquivo PDF</label>
                                    <input type="text" placeholder="Ex: Manual Técnico WEG CFW700 PDF" required
                                        className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary/50"
                                        value={manualTitle} onChange={e => setManualTitle(e.target.value)} />
                                </div>
                                <div>
                                    <div className="flex justify-between items-end mb-2">
                                        <label className="block text-sm font-bold text-gray-700">Link do PDF ou Upload</label>
                                        <div className="relative overflow-hidden">
                                            <button type="button" className="text-xs font-bold bg-primary text-white px-3 py-1.5 rounded-lg flex items-center gap-1 hover:bg-red-700 transition-colors shadow-sm disabled:opacity-50" disabled={uploadingKeys['manualRef']}>
                                                {uploadingKeys['manualRef'] ? 'Enviando PDF...' : <><UploadCloud size={14} /> Fazer Upload de PDF</>}
                                            </button>
                                            <input 
                                                type="file" 
                                                accept=".pdf"
                                                onChange={(e) => handleModalFileUpload(e, 'manual')}
                                                disabled={uploadingKeys['manualRef']}
                                                className="absolute inset-0 opacity-0 cursor-pointer disabled:cursor-not-allowed" 
                                            />
                                        </div>
                                    </div>
                                    <div className="relative">
                                       <Link2 className="absolute left-4 top-3.5 text-gray-400" size={18}/>
                                       <input type="url" placeholder="https://drive.google.com/... ou Upload Automático" required
                                           disabled={uploadingKeys['manualRef']}
                                           className="w-full pl-11 bg-white border border-gray-200 rounded-xl px-4 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary/50 disabled:bg-gray-100 disabled:text-gray-400"
                                           value={manualLink} onChange={e => setManualLink(e.target.value)} />
                                    </div>
                                </div>
                                <button type="submit" className="w-full mt-4 bg-primary hover:bg-red-700 text-white font-bold py-3 rounded-xl transition-colors shadow-lg shadow-red-500/20 flex items-center justify-center gap-2">
                                    <UploadCloud size={20} /> {editingManualId ? 'Atualizar Vínculo' : 'Salvar Vínculo'}
                                </button>
                            </form>
                        </div>
                    </FadeIn>
                </div>
            )}

            {/* Modal de Blog (Novo/Editar Post) */}
            {isBlogModalOpen && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <FadeIn delay={0}>
                        <div className="bg-white rounded-2xl w-full max-w-6xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
                            <div className="bg-gray-50 border-b border-gray-100 p-6 flex justify-between items-center shrink-0">
                                <h3 className="font-black text-gray-900 text-lg uppercase tracking-tight">
                                    {editingPostId ? 'Editar Artigo' : 'Nova Publicação no Blog'}
                                </h3>
                                <button onClick={() => setIsBlogModalOpen(false)} className="text-gray-400 hover:text-gray-900 transition-colors bg-white p-2 border border-gray-200 rounded-full shadow-sm"><X size={20}/></button>
                            </div>
                            <form onSubmit={handleSavePost} className="p-8 space-y-6 overflow-y-auto">
                                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                                    <div className="lg:col-span-2 space-y-6">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div className="md:col-span-2">
                                                <label className="block text-xs font-black uppercase text-gray-400 tracking-widest mb-2">Título do Artigo</label>
                                                <input type="text" placeholder="Ex: O futuro da robótica industrial..." required
                                                    className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary/50"
                                                    value={postTitle} onChange={e => setPostTitle(e.target.value)} />
                                            </div>
                                            <div className="md:col-span-1">
                                                <label className="block text-xs font-black uppercase text-gray-400 tracking-widest mb-2">Resumo (Chamada rápida)</label>
                                                <input type="text" placeholder="Uma frase curta para atrair o leitor..." required
                                                    className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary/50"
                                                    value={postResumo} onChange={e => setPostResumo(e.target.value)} />
                                            </div>
                                            <div className="md:col-span-1">
                                                <label className="block text-xs font-black uppercase text-gray-400 tracking-widest mb-2 flex items-center gap-2">
                                                    <Calendar size={12} className="text-primary"/> Data de Publicação (Agendamento)
                                                </label>
                                                <input type="datetime-local" required
                                                    className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary/50"
                                                    value={postData} onChange={e => setPostData(e.target.value)} />
                                            </div>
                                            <div className="md:col-span-2">
                                                <div className="flex items-end justify-between mb-2">
                                                    <label className="block text-xs font-black uppercase text-gray-400 tracking-widest">URL da Imagem de Destaque ou Upload</label>
                                                    <div className="relative overflow-hidden">
                                                        <button type="button" className="text-[10px] font-bold bg-primary text-white px-2 py-1 rounded flex items-center gap-1 hover:bg-red-700 transition-colors disabled:opacity-50" disabled={uploadingKeys['blogRef']}>
                                                            {uploadingKeys['blogRef'] ? 'Enviando...' : <><UploadCloud size={12} /> Upload PC</>}
                                                        </button>
                                                        <input 
                                                            type="file" 
                                                            accept="image/*"
                                                            onChange={(e) => handleModalFileUpload(e, 'blog')}
                                                            disabled={uploadingKeys['blogRef']}
                                                            className="absolute inset-0 opacity-0 cursor-pointer disabled:cursor-not-allowed" 
                                                        />
                                                    </div>
                                                </div>
                                                <input type="url" placeholder="https://unsplash.com/foto... ou Upload Automático" required
                                                    disabled={uploadingKeys['blogRef']}
                                                    className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary/50 disabled:text-gray-400"
                                                    value={postImage} onChange={e => setPostImage(e.target.value)} />
                                            </div>
                                            <div className="md:col-span-2">
                                                <label className="block text-xs font-black uppercase text-gray-400 tracking-widest mb-4">Conteúdo do Artigo</label>
                                                <RichTextEditor 
                                                    content={postConteudo} 
                                                    onChange={(html) => setPostConteudo(html)} 
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="lg:col-span-1">
                                        <div className="sticky top-0">
                                            <SEOPanel 
                                                title={postTitle}
                                                summary={postResumo}
                                                content={postConteudo}
                                                imageUrl={postImage}
                                            />
                                        </div>
                                    </div>
                                </div>
                                <button type="submit" className="w-full bg-primary hover:bg-accent text-white font-bold py-4 rounded-lg transition-all shadow-lg shadow-primary/20 flex items-center justify-center gap-2 uppercase tracking-widest text-xs">
                                    {editingPostId ? 'Salvar Alterações' : 'Publicar Agora'}
                                </button>
                            </form>
                        </div>
                    </FadeIn>
                </div>
            )}

            {/* Modal de Detalhes do Lead */}
            {isLeadModalOpen && selectedLead && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <FadeIn delay={0}>
                        <div className="bg-white rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl">
                            <div className="bg-gray-50 border-b border-gray-100 p-6 flex justify-between items-center">
                                <div className="flex items-center gap-3">
                                   <div className="w-10 h-10 bg-primary/10 text-primary rounded-full flex items-center justify-center">
                                      <Mail size={20} />
                                   </div>
                                   <div>
                                      <h3 className="font-black text-gray-900 leading-tight">Detalhes do Contato</h3>
                                      <p className="text-xs text-gray-500 font-bold uppercase tracking-widest">{selectedLead.data}</p>
                                   </div>
                                </div>
                                <button onClick={() => setIsLeadModalOpen(false)} className="text-gray-400 hover:text-gray-900 transition-colors bg-white p-2 border border-gray-200 rounded-full shadow-sm"><X size={20}/></button>
                            </div>
                            <div className="p-8 space-y-6">
                                <div className="grid grid-cols-2 gap-4">
                                   <div className="space-y-1">
                                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Nome do Cliente</p>
                                      <p className="font-bold text-gray-900">{selectedLead.name}</p>
                                   </div>
                                   <div className="space-y-1">
                                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">E-mail</p>
                                      <p className="font-bold text-gray-900 break-all">{selectedLead.email}</p>
                                   </div>
                                </div>
                                <div className="space-y-1 pt-4 border-t border-gray-50">
                                   <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Assunto</p>
                                   <p className="font-black text-primary text-lg">{selectedLead.subject}</p>
                                </div>
                                <div className="space-y-1 pt-4 border-t border-gray-50">
                                   <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Mensagem / Sintoma</p>
                                   <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 whitespace-pre-wrap text-gray-700 leading-relaxed max-h-48 overflow-y-auto">
                                      {selectedLead.message}
                                   </div>
                                </div>
                                
                                <div className="flex gap-3 pt-4">
                                   <a href={`mailto:${selectedLead.email}`} className="flex-1 bg-gray-900 hover:bg-black text-white font-bold py-3 rounded-xl transition-all flex items-center justify-center gap-2 text-sm">
                                      <Mail size={16} /> Responder via E-mail
                                   </a>
                                   <button 
                                      onClick={() => { removerLead(selectedLead.id); setIsLeadModalOpen(false); }}
                                      className="px-6 bg-red-50 text-red-500 hover:bg-red-500 hover:text-white font-bold py-3 rounded-xl transition-all border border-red-100"
                                   >
                                      <Trash2 size={18} />
                                   </button>
                                </div>
                            </div>
                        </div>
                    </FadeIn>
                </div>
            )}

            {/* Sidebar Cockpit */}
            <aside className="w-full md:w-64 bg-[#0a0f18] text-white flex flex-col shrink-0">
                <div className="p-6 border-b border-white/10">
                    <h2 className="text-xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400 uppercase tracking-widest flex items-center gap-2">
                        <Database size={20} className="text-primary" /> Painel GCA
                    </h2>
                </div>
                <nav className="flex-1 p-4 space-y-2">
                    <button 
                        onClick={() => setActiveTab('manuais')}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-colors ${activeTab === 'manuais' ? 'bg-primary text-white shadow-lg shadow-red-500/20' : 'bg-transparent text-gray-400 hover:bg-white/5'}`}
                    >
                        <LayoutDashboard size={18} /> Acervo Digital
                    </button>
                    <button 
                        onClick={() => setActiveTab('midia')}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-colors ${activeTab === 'midia' ? 'bg-primary text-white shadow-lg shadow-red-500/20' : 'bg-transparent text-gray-400 hover:bg-white/5'}`}
                    >
                        <ImageIcon size={18} /> Mídias do Site
                    </button>
                    <button 
                        onClick={() => setActiveTab('blog')}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-colors ${activeTab === 'blog' ? 'bg-primary text-white shadow-lg shadow-red-500/20' : 'bg-transparent text-gray-400 hover:bg-white/5'}`}
                    >
                        <Newspaper size={18} /> Gerenciar Blog
                    </button>
                    <button 
                        onClick={() => setActiveTab('textos')}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-colors ${activeTab === 'textos' ? 'bg-primary text-white shadow-lg shadow-red-500/20' : 'bg-transparent text-gray-400 hover:bg-white/5'}`}
                    >
                        <Type size={18} /> Textos do Site
                    </button>
                    <button 
                        onClick={() => setActiveTab('leads')}
                        className={`w-full flex items-center justify-between px-4 py-3 rounded-lg font-medium transition-colors ${activeTab === 'leads' ? 'bg-primary text-white shadow-lg shadow-red-500/20' : 'bg-transparent text-gray-400 hover:bg-white/5'}`}
                    >
                        <div className="flex items-center gap-3">
                            <Mail size={18} /> Mensagens
                        </div>
                        {unreadLeadsCount > 0 && (
                            <span className="bg-red-500 text-white text-[10px] font-black px-1.5 py-0.5 rounded-full animate-pulse">
                                {unreadLeadsCount}
                            </span>
                        )}
                    </button>
                </nav>
                <div className="p-4 border-t border-white/10 space-y-2">
                    <button 
                        onClick={() => setActiveTab('security')}
                        className={`w-full flex items-center justify-between px-4 py-3 rounded-lg font-medium transition-colors ${activeTab === 'security' ? 'bg-emerald-500/20 text-emerald-400 shadow-lg' : 'bg-transparent text-gray-400 hover:bg-white/5'}`}
                    >
                        <div className="flex items-center gap-3">
                            <ShieldCheck size={18} /> Segurança & Acessos
                        </div>
                    </button>
                    <div className="flex items-center gap-3 px-4 py-3 bg-red-500/10 text-red-400 rounded-lg cursor-pointer hover:bg-red-500/20 transition-colors" onClick={logout}>
                        <LogOut size={18} /> Encerrar Sessão
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 p-6 md:p-10 overflow-y-auto">
                <FadeIn>
                    <header className="mb-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div>
                            <h1 className="text-3xl font-black text-gray-900 truncate">
                                {activeTab === 'manuais' ? 'Gestão de Conteúdo' : activeTab === 'blog' ? 'Editor de Blog' : activeTab === 'textos' ? 'Textos & Institucional' : activeTab === 'leads' ? 'Gerenciador de Leads' : 'Imagens & Links Dinâmicos'}
                            </h1>
                            <p className="text-gray-500 mt-1">Configurações globais com salvamento automático.</p>
                        </div>
                        
                        {activeTab === 'manuais' && (
                           <div className="flex bg-white rounded-xl shadow-sm border border-gray-100 p-2 shrink-0">
                               <div className="px-4 py-2 border-r border-gray-100">
                                   <span className="block text-xs text-gray-400 font-bold uppercase tracking-wider mb-1">Marcas ativas</span>
                                   <span className="text-xl font-black text-gray-800">{marcas.length}</span>
                               </div>
                               <div className="px-4 py-2">
                                   <span className="block text-xs text-gray-400 font-bold uppercase tracking-wider mb-1">Blinks Totais</span>
                                   <span className="text-xl font-black text-primary flex items-center gap-1">
                                       <BarChart3 size={16} /> {totalManuais}
                                   </span>
                               </div>
                           </div>
                        )}

                        {activeTab === 'blog' && (
                           <div className="flex bg-white rounded-xl shadow-sm border border-gray-100 p-2 shrink-0">
                               <div className="px-4 py-2">
                                   <span className="block text-xs text-gray-400 font-bold uppercase tracking-wider mb-1">Total de Artigos</span>
                                   <span className="text-xl font-black text-primary flex items-center gap-1">
                                       <Newspaper size={16} /> {blogPosts.length}
                                   </span>
                               </div>
                           </div>
                        )}

                        {activeTab === 'leads' && (
                           <div className="flex items-center gap-4">
                               <button 
                                  onClick={marcarTodosLidos}
                                  className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-xs font-bold text-gray-500 hover:text-primary transition-all shadow-sm"
                               >
                                  <CheckCheck size={16} /> LER TODAS
                               </button>
                               <div className="flex bg-white rounded-xl shadow-sm border border-gray-100 p-2 shrink-0">
                                   <div className="px-4 py-2">
                                       <span className="block text-xs text-gray-400 font-bold uppercase tracking-wider mb-1">Mensagens Totais</span>
                                       <span className="text-xl font-black text-primary flex items-center gap-1">
                                           <Mail size={16} /> {leads.length}
                                       </span>
                                   </div>
                               </div>
                           </div>
                        )}
                    </header>
                </FadeIn>

                {/* TAB: ACERVO / MANUAIS */}
                {activeTab === 'manuais' && (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Coluna Esquerda: Adicionar Marca */}
                        <div className="lg:col-span-1">
                            <FadeIn delay={0.1}>
                                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 sticky top-6">
                                    <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                                        <FolderPlus size={20} className="text-primary" /> Adicionar Categoria
                                    </h3>
                                    <form onSubmit={handleAdicionarMarca} className="space-y-4">
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-2">Nome do Fabricante / Marca</label>
                                            <input type="text" value={novaMarcaInput} onChange={(e) => setNovaMarcaInput(e.target.value)} placeholder="Ex: ALLEN-BRADLEY"
                                                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary/50" />
                                        </div>
                                        <button type="submit" disabled={novaMarcaLoading || !novaMarcaInput.trim()}
                                            className="w-full bg-gray-900 hover:bg-black text-white font-bold py-3 rounded-xl transition-all disabled:opacity-50">
                                            {novaMarcaLoading ? 'Criando Pasta...' : 'Salvar no Banco'}
                                        </button>
                                    </form>
                                </div>
                            </FadeIn>
                        </div>

                        {/* Coluna Direita: Tabela */}
                        <div className="lg:col-span-2">
                            <StaggerContainer className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                                <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                                    <h3 className="text-lg font-bold text-gray-900">Diretórios Ativos ({marcas.length})</h3>
                                </div>
                                <div className="divide-y divide-gray-100 h-[600px] overflow-y-auto">
                                    {isInitialLoading ? (
                                        [1, 2, 3, 4, 5].map(i => (
                                            <div key={i} className="p-6 flex items-center gap-4">
                                                <Skeleton width="48px" height="48px" rounded="rounded-xl" />
                                                <div className="flex-1 space-y-2">
                                                    <Skeleton width="40%" height="20px" />
                                                    <Skeleton width="20%" height="12px" />
                                                </div>
                                            </div>
                                        ))
                                    ) : marcas.map((marca) => (
                                        <StaggerItem key={marca.id} className="p-4 hover:bg-gray-50/80 transition-colors flex flex-col gap-4 group">
                                           <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                                <div className="flex items-center gap-4">
                                                    <div className={`w-12 h-12 rounded-xl ${marca.iconColor} text-white flex items-center justify-center font-black text-xl shadow-inner shrink-0`}>
                                                        {marca.nome.charAt(0)}
                                                    </div>
                                                    <div>
                                                        <h4 className="font-bold text-gray-900 uppercase tracking-wide cursor-pointer flex items-center gap-2 hover:text-primary transition-colors select-none" onClick={() => toggleMarcaExpand(marca.id)} title="Clique para ver os arquivos">
                                                            {marca.nome}
                                                            {expandedMarcaId === marca.id ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                                                        </h4>
                                                        <p className="text-xs text-gray-500 font-medium cursor-pointer select-none" onClick={() => toggleMarcaExpand(marca.id)}>
                                                           {Array.isArray(marca.manuais) ? marca.manuais.length : 0} Documentos Anexados
                                                        </p>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <button onClick={() => openUploadModal(marca)} className="bg-primary/10 text-primary hover:bg-primary hover:text-white px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 transition-colors border border-primary/20">
                                                        <Link2 size={16} /> Inserir Link de Documento
                                                    </button>
                                                    <button onClick={() => removerMarca(marca.id)} className="text-gray-400 hover:text-red-500 p-2 hover:bg-red-50 border border-transparent hover:border-red-100 rounded-lg transition-all" title="Deletar Marca e seus Arquivos">
                                                        <Trash2 size={18} />
                                                    </button>
                                                </div>
                                           </div>

                                            {/* Sub-lista de Manuais Expandida */}
                                            {expandedMarcaId === marca.id && marca.manuais && marca.manuais.length > 0 && (
                                                <div className="w-full mt-2 bg-white border border-gray-100 rounded-xl overflow-hidden shadow-inner">
                                                    <div className="bg-gray-50 px-4 py-2 border-b border-gray-100 flex justify-between items-center">
                                                        <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Arquivos Salvos nesta Categoria</span>
                                                    </div>
                                                    <ul className="divide-y divide-gray-50">
                                                        {marca.manuais.map(manual => (
                                                            <li key={manual.id} className="p-3 hover:bg-gray-50 flex flex-col md:flex-row md:items-center justify-between gap-2 group/item transition-colors break-all">
                                                                <div className="flex flex-col md:flex-row md:items-center gap-3">
                                                                    <div className="bg-blue-50 text-blue-500 p-2 rounded-lg shrink-0 w-fit">
                                                                        <Link2 size={14} />
                                                                    </div>
                                                                    <div>
                                                                        <a href={manual.link} target="_blank" rel="noreferrer" className="text-sm font-bold text-gray-800 hover:text-primary transition-colors block leading-tight mb-1">
                                                                            {manual.titulo}
                                                                        </a>
                                                                        <span className="text-[10px] text-gray-400 font-mono block hover:text-gray-600 transition-colors">{manual.link}</span>
                                                                    </div>
                                                                </div>
                                                                <div className="flex items-center gap-1 opacity-100 md:opacity-0 md:group-hover/item:opacity-100 transition-opacity">
                                                                    <button onClick={() => openUploadModal(marca, manual)} className="text-gray-400 hover:text-blue-500 p-2 hover:bg-blue-50 rounded-lg transition-all" title="Editar">
                                                                        <Edit size={16} />
                                                                    </button>
                                                                    <button onClick={() => removerManual(marca.id, manual.id)} className="text-gray-400 hover:text-red-500 p-2 hover:bg-red-50 rounded-lg transition-all" title="Excluir">
                                                                        <Trash2 size={16} />
                                                                    </button>
                                                                </div>
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            )}
                                        </StaggerItem>
                                    ))}
                                </div>
                            </StaggerContainer>
                        </div>
                    </div>
                )}

                {/* TAB: MíDIAS SITE */}
                {activeTab === 'midia' && (
                    <FadeIn>
                        <div className="space-y-6">
                            {/* Sessão Global */}
                            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
                                <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                                    <Globe size={20} className="text-primary"/> Configurações Globais (SEO)
                                </h3>
                                <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100 space-y-4">
                                    <div className="space-y-2">
                                        <div className="flex items-center justify-between">
                                            <label className="text-[10px] font-black uppercase text-gray-400 tracking-wider">URL do Favicon (.ico / .png)</label>
                                            <div className="relative overflow-hidden cursor-pointer">
                                                <span className="text-[10px] font-bold text-primary flex items-center gap-1 cursor-pointer hover:underline">
                                                    {uploadingKeys['favicon'] ? 'Enviando...' : <><UploadCloud size={12}/> Enviar do PC</>}
                                                </span>
                                                <input 
                                                    type="file" 
                                                    accept=".ico,.png,.jpg,.jpeg"
                                                    disabled={uploadingKeys['favicon']}
                                                    onChange={(e) => handleFileUpload(e, 'favicon', 'favicon', 'favicon')}
                                                    className="absolute inset-0 opacity-0 cursor-pointer disabled:cursor-not-allowed" 
                                                />
                                            </div>
                                        </div>
                                        <div className="relative">
                                            <Globe className="absolute left-3 top-3 text-gray-400" size={16} />
                                            <input 
                                                type="url" 
                                                placeholder="https://exemplo.com/favicon.png"
                                                value={siteMedia.favicon?.url || ''} 
                                                onChange={(e) => atualizarMedia('favicon', 'url', e.target.value)}
                                                disabled={uploadingKeys['favicon']}
                                                className={`w-full pl-10 pr-4 py-2 border rounded-lg outline-none text-sm transition-all ${uploadingKeys['favicon'] ? 'bg-gray-100 border-gray-200 text-gray-400' : 'bg-white border-gray-200 focus:ring-2 focus:ring-primary/20'}`} />
                                        </div>
                                    </div>
                                    {siteMedia.favicon?.url && (
                                        <div className="flex items-center gap-3 p-3 bg-white border border-gray-200 rounded-xl w-fit">
                                            <img src={siteMedia.favicon.url} alt="Favicon Preview" className="w-8 h-8 object-contain" />
                                            <span className="text-xs text-gray-500 font-bold uppercase tracking-widest">Prévia Ícone Aba</span>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Sessão Imagens por Página */}
                            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
                                <h3 className="text-xl font-bold text-gray-900 mb-8 flex items-center gap-2">
                                    <ImageIcon size={20} className="text-primary"/> Gerenciador de Banners e Imagens
                                </h3>
                                
                                <div className="space-y-8">
                                    {renderMediaInput("Logomarca da Empresa (Circular)", "logo")}
                                    {renderMediaInput("Página Inicial (Hero Principal)", "home")}
                                    {renderMediaInput("Sobre Nós (Banner Superior)", "about")}
                                    {renderMediaInput("Sobre Nós (Imagem Lateral)", "aboutSide")}
                                    {renderMediaInput("Serviços (Banner Superior)", "services")}
                                    {renderMediaInput("Serviços (Seção Laboratório)", "servicesLab")}
                                    {renderMediaInput("Laboratório (Banner Superior)", "laboratory")}
                                    {renderMediaInput("Contato (Banner Superior)", "contact")}
                                </div>
                            </div>
                        </div>
                    </FadeIn>
                )}

                {/* TAB: GERENCIAR BLOG */}
                {activeTab === 'blog' && (
                    <FadeIn>
                        <div className="space-y-6">
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                                    <Newspaper size={22} className="text-primary"/> Postagens Publicadas
                                </h3>
                                <button onClick={() => openBlogModal()} className="bg-primary hover:bg-accent text-white font-bold px-6 py-3 rounded-lg transition-all shadow-lg shadow-primary/20 flex items-center gap-2 text-xs uppercase tracking-widest">
                                    <Plus size={16}/> Novo Artigo
                                </button>
                            </div>

                            <div className="grid grid-cols-1 gap-4">
                                {isInitialLoading ? (
                                    [1, 2, 3].map(i => (
                                        <div key={i} className="bg-white p-6 rounded-2xl border border-gray-100 flex flex-col md:flex-row items-center gap-6">
                                            <Skeleton width="128px" height="96px" rounded="rounded-lg" />
                                            <div className="flex-1 space-y-2">
                                                <Skeleton width="60%" height="24px" />
                                                <Skeleton width="30%" height="16px" />
                                            </div>
                                        </div>
                                    ))
                                ) : blogPosts.map(post => (
                                    <div key={post.id} className="bg-white p-6 rounded-2xl border border-gray-100 flex flex-col md:flex-row items-center gap-6 group hover:shadow-lg transition-all">
                                        <div className="w-full md:w-32 h-24 rounded-lg overflow-hidden shrink-0 border border-gray-100">
                                            <img src={post.imageUrl} alt="" className="w-full h-full object-cover" />
                                        </div>
                                        <div className="flex-1 text-center md:text-left">
                                            <h4 className="font-bold text-gray-900 text-lg mb-1">{post.titulo}</h4>
                                            <div className="flex flex-wrap justify-center md:justify-start items-center gap-4 text-xs text-gray-400 font-bold uppercase tracking-wider">
                                                <span className="flex items-center gap-1"><Calendar size={12} className="text-accent"/> {new Date(post.data).toLocaleDateString('pt-BR', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                                                <span className="flex items-center gap-1"><User size={12}/> {post.autor}</span>
                                                {new Date(post.data) > new Date() ? (
                                                    <span className="px-2 py-0.5 bg-amber-100 text-amber-600 rounded text-[10px] font-black uppercase">Agendado</span>
                                                ) : (
                                                    <span className="px-2 py-0.5 bg-emerald-100 text-emerald-600 rounded text-[10px] font-black uppercase">Publicado</span>
                                                )}
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <button onClick={() => openBlogModal(post)} className="p-3 bg-blue-50 text-blue-500 hover:bg-blue-500 hover:text-white rounded-xl transition-all border border-blue-100">
                                                <Edit size={18} />
                                            </button>
                                            <button onClick={() => removerPost(post.id)} className="p-3 bg-red-50 text-red-500 hover:bg-red-500 hover:text-white rounded-xl transition-all border border-red-100">
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    </div>
                                ))}

                                {blogPosts.length === 0 && (
                                    <div className="text-center py-20 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200">
                                        <p className="text-gray-400 font-bold uppercase tracking-widest">Nenhum post encontrado.</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </FadeIn>
                )}

                {/* TAB: TEXTOS DO SITE (CMS) */}
                {activeTab === 'textos' && (
                    <FadeIn>
                        <div className="space-y-8">
                            {/* Sessão Sobre Nós */}
                            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
                                <h3 className="text-xl font-bold text-gray-900 mb-8 flex items-center gap-2">
                                    <Edit size={20} className="text-primary"/> CMS Total: Gerenciador de Conteúdo
                                </h3>

                                {/* Sub-navegação interna */}
                                <div className="flex flex-wrap gap-2 mb-8 border-b border-gray-100 pb-4">
                                    {[
                                        { id: 'global', label: 'Contatos & Rodapé' },
                                        { id: 'home', label: 'Página Inicial' },
                                        { id: 'about', label: 'Sobre Nós' },
                                        { id: 'services', label: 'Serviços' },
                                        { id: 'laboratory', label: 'Laboratório' }
                                    ].map(btn => (
                                        <button 
                                            key={btn.id}
                                            onClick={() => setActiveTextSection(btn.id)}
                                            className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-widest transition-all ${activeTextSection === btn.id ? 'bg-primary text-white shadow-md' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'}`}
                                        >
                                            {btn.label}
                                        </button>
                                    ))}
                                </div>
                                
                                <div className="space-y-8">
                                    {/* SEÇÃO: GLOBAL */}
                                    {activeTextSection === 'global' && (
                                        <div className="space-y-6">
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                <div>
                                                    <label className="text-[10px] font-black uppercase text-gray-400 tracking-wider mb-2 block">Telefone Fixo</label>
                                                    <input type="text" value={siteContent?.global?.phone || ''} 
                                                        onChange={(e) => atualizarConteudo('global', 'phone', e.target.value)}
                                                        placeholder="(19) 3462-8501"
                                                        className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary/50" />
                                                </div>
                                                <div>
                                                    <label className="text-[10px] font-black uppercase text-gray-400 tracking-wider mb-2 block">Plantão WhatsApp</label>
                                                    <input type="text" value={siteContent?.global?.whatsapp || ''} 
                                                        onChange={(e) => atualizarConteudo('global', 'whatsapp', e.target.value)}
                                                        placeholder="(19) 99876-5432"
                                                        className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary/50" />
                                                </div>
                                                <div>
                                                    <label className="text-[10px] font-black uppercase text-gray-400 tracking-wider mb-2 block">E-mail Corporativo</label>
                                                    <input type="email" value={siteContent?.global?.email || ''} 
                                                        onChange={(e) => atualizarConteudo('global', 'email', e.target.value)}
                                                        placeholder="contato@gcaautomacao.com.br"
                                                        className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary/50" />
                                                </div>
                                                <div className="md:col-span-2">
                                                    <label className="text-[10px] font-black uppercase text-gray-400 tracking-wider mb-2 block">Endereço Completo</label>
                                                    <input type="text" value={siteContent?.global?.address || ''} 
                                                        onChange={(e) => atualizarConteudo('global', 'address', e.target.value)}
                                                        placeholder="Rua Exemplo, 123 - Americana/SP"
                                                        className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary/50" />
                                                </div>
                                                <div>
                                                    <label className="text-[10px] font-black uppercase text-gray-400 tracking-wider mb-2 block">CEP</label>
                                                    <input type="text" value={siteContent?.global?.cep || ''} 
                                                        onChange={(e) => atualizarConteudo('global', 'cep', e.target.value)}
                                                        placeholder="13470-000"
                                                        className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary/50" />
                                                </div>
                                                <div>
                                                    <label className="text-[10px] font-black uppercase text-gray-400 tracking-wider mb-2 block">N° WhatsApp (com código país, sem +)</label>
                                                    <input type="text" value={siteContent?.global?.whatsappNumber || ''} 
                                                        onChange={(e) => atualizarConteudo('global', 'whatsappNumber', e.target.value)}
                                                        placeholder="5519971206717"
                                                        className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary/50" />
                                                </div>
                                                <div>
                                                    <label className="text-[10px] font-black uppercase text-gray-400 tracking-wider mb-2 block">Cidade / UF</label>
                                                    <input type="text" value={siteContent?.global?.cityState || ''} 
                                                        onChange={(e) => atualizarConteudo('global', 'cityState', e.target.value)}
                                                        placeholder="Americana/SP"
                                                        className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary/50" />
                                                </div>
                                            </div>

                                            {/* Google Search Console */}
                                            <div className="pt-6 border-t border-gray-100 space-y-4">
                                                <div className="flex items-start gap-4 p-5 bg-blue-50 rounded-2xl border border-blue-100">
                                                    <Globe size={22} className="text-blue-500 shrink-0 mt-0.5" />
                                                    <div>
                                                        <h4 className="font-black text-gray-900 text-sm mb-1">Google Search Console</h4>
                                                        <p className="text-xs text-gray-500 leading-relaxed">Cole aqui o código de verificação que o Google fornece. Acesse <a href="https://search.google.com/search-console" target="_blank" rel="noreferrer" className="text-blue-600 font-bold underline">search.google.com/search-console</a>, adicione seu domínio, escolha o método "Tag HTML" e copie apenas o valor do atributo <code className="bg-blue-100 px-1 rounded">content="..."</code>.</p>
                                                    </div>
                                                </div>
                                                <div>
                                                    <label className="text-[10px] font-black uppercase text-gray-400 tracking-wider mb-2 block">Código de Verificação do Google</label>
                                                    <input type="text" value={siteContent?.global?.googleVerificationCode || ''} 
                                                        onChange={(e) => atualizarConteudo('global', 'googleVerificationCode', e.target.value)}
                                                        placeholder="Cole aqui: Ex: abc123xyz..."
                                                        className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary/50 font-mono text-sm" />
                                                    {siteContent?.global?.googleVerificationCode && (
                                                        <p className="mt-2 text-xs text-green-600 font-bold flex items-center gap-1">
                                                            <span className="w-2 h-2 bg-green-500 rounded-full inline-block"></span>
                                                            Código ativo. Deploy o site para que o Google possa verificar.
                                                        </p>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {/* SEÇÃO: HOME */}
                                    {activeTextSection === 'home' && (
                                        <div className="space-y-10">
                                            {/* Slides */}
                                            <div className="space-y-6">
                                                <h4 className="text-sm font-bold text-gray-800 uppercase tracking-widest border-l-4 border-primary pl-4">Slides Principais (Hero)</h4>
                                                {(siteContent?.home?.slides || []).map((slide, idx) => (
                                                    <div key={idx} className="p-6 bg-gray-50 rounded-2xl border border-gray-200 space-y-4">
                                                        <span className="text-[10px] font-black text-primary uppercase">Slide {idx + 1}</span>
                                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                            <div>
                                                                <label className="text-[10px] font-bold text-gray-400 uppercase mb-2 block">Título</label>
                                                                <input type="text" value={slide.title} 
                                                                    onChange={(e) => atualizarArrayConteudo('home', 'slides', idx, 'title', e.target.value)}
                                                                    className="w-full bg-white border border-gray-200 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50" />
                                                            </div>
                                                            <div>
                                                                <label className="text-[10px] font-bold text-gray-400 uppercase mb-2 block">Destaque (Cor)</label>
                                                                <input type="text" value={slide.highlight} 
                                                                    onChange={(e) => atualizarArrayConteudo('home', 'slides', idx, 'highlight', e.target.value)}
                                                                    className="w-full bg-white border border-gray-200 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50" />
                                                            </div>
                                                            <div className="md:col-span-2">
                                                                <label className="text-[10px] font-bold text-gray-400 uppercase mb-2 block">Descrição Curta</label>
                                                                <input type="text" value={slide.desc} 
                                                                    onChange={(e) => atualizarArrayConteudo('home', 'slides', idx, 'desc', e.target.value)}
                                                                    className="w-full bg-white border border-gray-200 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50" />
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>

                                            {/* Expertise */}
                                            <div className="space-y-4">
                                                <h4 className="text-sm font-bold text-gray-800 uppercase tracking-widest border-l-4 border-primary pl-4">Seção: Expertise Absoluta</h4>
                                                <div className="grid grid-cols-1 gap-4">
                                                    <input type="text" value={siteContent?.home?.expertise?.badge || ''} 
                                                        onChange={(e) => atualizarConteudo('home', 'expertise', { ...siteContent?.home?.expertise, badge: e.target.value })}
                                                        placeholder="Badge superior"
                                                        className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary/50" />
                                                    <input type="text" value={siteContent?.home?.expertise?.title || ''} 
                                                        onChange={(e) => atualizarConteudo('home', 'expertise', { ...siteContent?.home?.expertise, title: e.target.value })}
                                                        placeholder="Título principal"
                                                        className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary/50 font-bold" />
                                                    <textarea rows={3} value={siteContent?.home?.expertise?.text || ''} 
                                                        onChange={(e) => atualizarConteudo('home', 'expertise', { ...siteContent?.home?.expertise, text: e.target.value })}
                                                        placeholder="Texto de descrição"
                                                        className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary/50" />
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {/* SEÇÃO: SOBRE (Reuso da estrutura anterior com melhorias) */}
                                    {activeTextSection === 'about' && (
                                        <div className="space-y-6">
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-b border-gray-100 pb-6">
                                                <div>
                                                    <label className="text-[10px] font-black uppercase text-gray-400 tracking-wider mb-2 block">Título do Hero</label>
                                                    <input type="text" value={siteContent?.about?.heroTitle || ''} 
                                                        onChange={(e) => atualizarConteudo('about', 'heroTitle', e.target.value)}
                                                        className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm font-bold" />
                                                </div>
                                                <div>
                                                    <label className="text-[10px] font-black uppercase text-gray-400 tracking-wider mb-2 block">Selo de Fundação (Badge)</label>
                                                    <input type="text" value={siteContent?.about?.foundationBadge || ''} 
                                                        onChange={(e) => atualizarConteudo('about', 'foundationBadge', e.target.value)}
                                                        className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm" />
                                                </div>
                                                <div className="md:col-span-2">
                                                    <label className="text-[10px] font-black uppercase text-gray-400 tracking-wider mb-2 block">Subtítulo do Hero</label>
                                                    <textarea rows={2} value={siteContent?.about?.heroSubtitle || ''} 
                                                        onChange={(e) => atualizarConteudo('about', 'heroSubtitle', e.target.value)}
                                                        className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm" />
                                                </div>
                                            </div>

                                            <div>
                                                <label className="text-[10px] font-black uppercase text-gray-400 tracking-wider mb-2 block">Título da História</label>
                                                <input type="text" value={siteContent?.about?.historyTitle || ''} 
                                                    onChange={(e) => atualizarConteudo('about', 'historyTitle', e.target.value)}
                                                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary/50" />
                                            </div>
                                            <div>
                                                <label className="text-[10px] font-black uppercase text-gray-400 tracking-wider mb-2 block">Texto Institucional (Descrição)</label>
                                                <textarea rows={4} value={siteContent?.about?.historyText || ''} 
                                                    onChange={(e) => atualizarConteudo('about', 'historyText', e.target.value)}
                                                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary/50" />
                                            </div>
                                            <div>
                                                <label className="text-[10px] font-black uppercase text-gray-400 tracking-wider mb-2 block">Frase em Destaque (Citação)</label>
                                                <textarea rows={2} value={siteContent?.about?.quote || ''} 
                                                    onChange={(e) => atualizarConteudo('about', 'quote', e.target.value)}
                                                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-gray-900 italic focus:outline-none focus:ring-2 focus:ring-primary/50" />
                                            </div>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                <div>
                                                    <label className="text-[10px] font-black uppercase text-gray-400 tracking-wider mb-2 block">Nossa Missão</label>
                                                    <textarea rows={3} value={siteContent?.about?.mission || ''} 
                                                        onChange={(e) => atualizarConteudo('about', 'mission', e.target.value)}
                                                        className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50" />
                                                </div>
                                                <div>
                                                    <label className="text-[10px] font-black uppercase text-gray-400 tracking-wider mb-2 block">Nossa Visão</label>
                                                    <textarea rows={3} value={siteContent?.about?.vision || ''} 
                                                        onChange={(e) => atualizarConteudo('about', 'vision', e.target.value)}
                                                        className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50" />
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {/* SEÇÃO: SERVIÇOS */}
                                    {activeTextSection === 'services' && (
                                        <div className="space-y-8">
                                            <div className="space-y-4">
                                                <h4 className="text-sm font-bold text-gray-800 uppercase tracking-widest border-l-4 border-primary pl-4">Cabeçalho de Serviços</h4>
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                    <input type="text" value={siteContent?.services?.hero?.badge || ''} 
                                                        onChange={(e) => atualizarConteudo('services', 'hero', { ...siteContent?.services?.hero, badge: e.target.value })}
                                                        placeholder="Badge" className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm" />
                                                    <input type="text" value={siteContent?.services?.hero?.title || ''} 
                                                        onChange={(e) => atualizarConteudo('services', 'hero', { ...siteContent?.services?.hero, title: e.target.value })}
                                                        placeholder="Título" className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm font-bold" />
                                                    <input type="text" value={siteContent?.services?.hero?.highlight || ''} 
                                                        onChange={(e) => atualizarConteudo('services', 'hero', { ...siteContent?.services?.hero, highlight: e.target.value })}
                                                        placeholder="Destaque" className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm" />
                                                    <textarea rows={2} value={siteContent?.services?.hero?.desc || ''} 
                                                        onChange={(e) => atualizarConteudo('services', 'hero', { ...siteContent?.services?.hero, desc: e.target.value })}
                                                        placeholder="Descrição" className="w-full md:col-span-2 bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm" />
                                                </div>
                                            </div>

                                            <div className="space-y-4">
                                                <h4 className="text-sm font-bold text-gray-800 uppercase tracking-widest border-l-4 border-primary pl-4">Laboratórios Mini (Rodapé da página)</h4>
                                                <div className="grid grid-cols-1 gap-4 p-6 bg-gray-50 rounded-2xl border border-gray-200">
                                                    <input type="text" value={siteContent?.services?.laboratoryMini?.title || ''} 
                                                        onChange={(e) => atualizarConteudo('services', 'laboratoryMini', { ...siteContent?.services?.laboratoryMini, title: e.target.value })}
                                                        className="w-full bg-white border border-gray-200 rounded-lg px-4 py-2 text-sm font-bold" />
                                                    <textarea rows={2} value={siteContent?.services?.laboratoryMini?.desc || ''} 
                                                        onChange={(e) => atualizarConteudo('services', 'laboratoryMini', { ...siteContent?.services?.laboratoryMini, desc: e.target.value })}
                                                        className="w-full bg-white border border-gray-200 rounded-lg px-4 py-2 text-sm" />
                                                    
                                                    <div className="space-y-2 mt-4">
                                                        <label className="text-[10px] font-bold text-gray-400 uppercase">Itens de Rack (Lista)</label>
                                                        {(siteContent?.services?.laboratoryMini?.items || []).map((item, id) => (
                                                            <input key={id} type="text" value={item} 
                                                                onChange={(e) => atualizarArrayConteudo('services', 'laboratoryMini', id, null, e.target.value)}
                                                                className="w-full bg-white border border-gray-200 rounded-lg px-4 py-2 text-xs" />
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {/* SEÇÃO: LABORATÓRIO */}
                                    {activeTextSection === 'laboratory' && (
                                        <div className="space-y-8">
                                            <div className="space-y-4">
                                                <h4 className="text-sm font-bold text-gray-800 uppercase tracking-widest border-l-4 border-primary pl-4">Textos do Hero</h4>
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                    <input type="text" value={siteContent?.laboratory?.hero?.title || ''} 
                                                        onChange={(e) => atualizarConteudo('laboratory', 'hero', { ...siteContent?.laboratory?.hero, title: e.target.value })}
                                                        className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm font-bold" />
                                                    <input type="text" value={siteContent?.laboratory?.hero?.highlight || ''} 
                                                        onChange={(e) => atualizarConteudo('laboratory', 'hero', { ...siteContent?.laboratory?.hero, highlight: e.target.value })}
                                                        className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm" />
                                                    <textarea rows={2} value={siteContent?.laboratory?.hero?.desc || ''} 
                                                        onChange={(e) => atualizarConteudo('laboratory', 'hero', { ...siteContent?.laboratory?.hero, desc: e.target.value })}
                                                        className="w-full md:col-span-2 bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm" />
                                                </div>
                                            </div>

                                            <div className="space-y-4">
                                                <h4 className="text-sm font-bold text-gray-800 uppercase tracking-widest border-l-4 border-primary pl-4">Seção: Performance em Carga</h4>
                                                <div className="grid grid-cols-1 gap-4 bg-gray-50 p-6 rounded-2xl border border-gray-200">
                                                    <input type="text" value={siteContent?.laboratory?.performance?.title || ''} 
                                                        onChange={(e) => atualizarConteudo('laboratory', 'performance', { ...siteContent?.laboratory?.performance, title: e.target.value })}
                                                        className="w-full bg-white border border-gray-200 rounded-lg px-4 py-2 text-sm font-bold" />
                                                    <input type="text" value={siteContent?.laboratory?.performance?.highlight || ''} 
                                                        onChange={(e) => atualizarConteudo('laboratory', 'performance', { ...siteContent?.laboratory?.performance, highlight: e.target.value })}
                                                        className="w-full bg-white border border-gray-200 rounded-lg px-4 py-2 text-sm" />
                                                    <textarea rows={2} value={siteContent?.laboratory?.performance?.text1 || ''} 
                                                        onChange={(e) => atualizarConteudo('laboratory', 'performance', { ...siteContent?.laboratory?.performance, text1: e.target.value })}
                                                        className="w-full bg-white border border-gray-200 rounded-lg px-4 py-2 text-sm" />
                                                    <textarea rows={2} value={siteContent?.laboratory?.performance?.text2 || ''} 
                                                        onChange={(e) => atualizarConteudo('laboratory', 'performance', { ...siteContent?.laboratory?.performance, text2: e.target.value })}
                                                        className="w-full bg-white border border-gray-200 rounded-lg px-4 py-2 text-sm" />
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </FadeIn>
                )}

                {/* TAB: LEADS (MENSAGENS) */}
                {activeTab === 'leads' && (
                    <FadeIn>
                        <div className="space-y-6">
                            {/* DASHBOARD DE LEADS */}
                            {!isInitialLoading && leadStats && (
                                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                                    {/* Cartões de Métricas */}
                                    <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-3 gap-4">
                                        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col justify-between">
                                            <div className="flex items-center justify-between mb-4">
                                                <div className="p-2 bg-blue-50 text-primary rounded-lg"><Mail size={20} /></div>
                                                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Total</span>
                                            </div>
                                            <div>
                                                <h4 className="text-3xl font-black text-gray-900">{leadStats.total}</h4>
                                                <p className="text-xs text-gray-500 font-bold uppercase mt-1">Mensagens</p>
                                            </div>
                                        </div>
                                        <div className="bg-white p-6 rounded-2xl border border-blue-100 shadow-sm shadow-blue-50 flex flex-col justify-between ring-2 ring-primary/5">
                                            <div className="flex items-center justify-between mb-4">
                                                <div className="p-2 bg-primary text-white rounded-lg"><Zap size={20} /></div>
                                                <span className="text-[10px] font-black text-primary uppercase tracking-widest">Novas</span>
                                            </div>
                                            <div>
                                                <h4 className="text-3xl font-black text-primary">{leadStats.unread}</h4>
                                                <p className="text-xs text-primary/70 font-bold uppercase mt-1">Não Lidas</p>
                                            </div>
                                        </div>
                                        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col justify-between">
                                            <div className="flex items-center justify-between mb-4">
                                                <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg"><BarChart3 size={20} /></div>
                                                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Atividade</span>
                                            </div>
                                            <div>
                                                <h4 className="text-3xl font-black text-emerald-600">+{leadStats.last7Days}</h4>
                                                <p className="text-xs text-gray-500 font-bold uppercase mt-1">Últimos 7 dias</p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Gráfico de Atividade Semanal */}
                                    <div className="bg-[#0a0f18] p-6 rounded-2xl border border-white/5 shadow-xl relative overflow-hidden">
                                        <div className="absolute inset-0 pattern-grid opacity-5" />
                                        <div className="relative z-10 h-full flex flex-col">
                                            <h5 className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-6">Frequência Semanal (Leads/Dia)</h5>
                                            <div className="flex-1 flex items-end justify-between gap-2 px-2">
                                                {leadStats.daily.map((d, i) => {
                                                    const maxVal = Math.max(...leadStats.daily.map(x => x.value), 1);
                                                    const heightPct = (d.value / maxVal) * 100;
                                                    return (
                                                        <div key={i} className="flex-1 flex flex-col items-center group">
                                                            <div className="w-full relative">
                                                                <div 
                                                                    className="w-full bg-primary rounded-t-sm transition-all duration-700 ease-out group-hover:bg-accent"
                                                                    style={{ height: `${Math.max(heightPct, 5)}%` }}
                                                                />
                                                                <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-white text-[10px] font-black text-primary px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                                                                    {d.value}
                                                                </div>
                                                            </div>
                                                            <span className="text-[8px] font-black text-gray-600 mt-2 uppercase">{d.label}</span>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                                <div className="p-6 border-b border-gray-50 flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <h3 className="text-lg font-bold text-gray-900">Mensagens Recebidas</h3>
                                        <span className="px-2 py-0.5 bg-gray-100 text-[10px] font-black text-gray-500 rounded-full">{leads.length}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <button 
                                            onClick={marcarTodosLidos}
                                            className="px-4 py-2 text-xs font-bold text-gray-500 hover:text-primary transition-colors flex items-center gap-2"
                                        >
                                            <CheckCheck size={16} /> Marcar tudo como lido
                                        </button>
                                    </div>
                                </div>
                                <div className="divide-y divide-gray-100 h-[650px] overflow-y-auto">
                                    {isInitialLoading ? (
                                        [1, 2, 3, 4].map(i => (
                                            <div key={i} className="p-6 flex flex-col gap-3">
                                                <div className="flex gap-4">
                                                    <Skeleton width="60px" height="18px" rounded="rounded-full" />
                                                    <Skeleton width="120px" height="18px" />
                                                </div>
                                                <Skeleton width="40%" height="24px" />
                                                <Skeleton width="70%" height="18px" />
                                            </div>
                                        ))
                                    ) : leads.map((lead) => (
                                        <div 
                                            key={lead.id} 
                                            className={`p-6 transition-all border-l-4 ${lead.lido ? 'border-transparent bg-white hover:bg-gray-50' : 'border-primary bg-blue-50/30'}`}
                                        >
                                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-center gap-3 mb-2">
                                                        <span className={`text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full ${lead.lido ? 'bg-gray-100 text-gray-400' : 'bg-primary text-white'}`}>
                                                            {lead.lido ? 'Lido' : 'Novo'}
                                                        </span>
                                                        <span className="text-xs text-gray-400 font-bold">{new Date(lead.data).toLocaleString('pt-BR')}</span>
                                                    </div>
                                                    <h4 className="text-lg font-black text-gray-900 truncate mb-1">{lead.subject}</h4>
                                                    <div className="flex items-center gap-4 text-sm text-gray-500">
                                                        <span className="flex items-center gap-1.5 font-bold"><User size={14} className="text-gray-400" /> {lead.name}</span>
                                                        <span className="text-gray-300">|</span>
                                                        <span className="flex items-center gap-1.5 text-primary font-bold"><Phone size={14} className="text-primary/50" /> {lead.phone}</span>
                                                        <span className="hidden md:inline text-gray-300">|</span>
                                                        <span className="flex items-center gap-1.5 truncate"><Mail size={14} className="text-gray-400" /> {lead.email}</span>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-3 shrink-0">
                                                    <button 
                                                        onClick={() => openLeadModal(lead)}
                                                        className="flex items-center gap-2 px-5 py-2.5 bg-white border border-gray-200 rounded-xl text-xs font-bold text-gray-700 hover:border-primary hover:text-primary transition-all shadow-sm"
                                                    >
                                                        <Eye size={16} /> VER COMPLETO
                                                    </button>
                                                    <button 
                                                        onClick={() => removerLead(lead.id)}
                                                        className="p-3 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                                                        title="Excluir mensagem"
                                                    >
                                                        <Trash2 size={18} />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    ))}

                                    {leads.length === 0 && (
                                        <div className="text-center py-32 space-y-4">
                                            <div className="w-20 h-20 bg-gray-50 text-gray-200 rounded-full flex items-center justify-center mx-auto">
                                                <Mail size={40} />
                                            </div>
                                            <p className="text-gray-400 font-black uppercase tracking-widest text-sm">Nenhuma mensagem recebida ainda.</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </FadeIn>
                )}

                {/* TAB: SECURITY E ADMINISTRAÇÃO */}
                {activeTab === 'security' && (
                    <FadeIn>
                        <div className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Formulario Senha */}
                                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
                                    <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                                        <KeyRound size={20} className="text-primary"/> Alterar Minha Senha
                                    </h3>
                                    <p className="text-sm text-gray-500 mb-6 font-medium">Troque a senha da sua conta de administrador atual ({adminEmail}).</p>
                                    <form onSubmit={handlePasswordChange} className="space-y-4">
                                        <div>
                                            <label className="block text-xs font-black uppercase text-gray-400 tracking-widest mb-2">Nova Senha</label>
                                            <input type="password" required minLength="6"
                                                className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary/50"
                                                placeholder="Mínimo 6 caracteres"
                                                value={newPass} onChange={e => setNewPass(e.target.value)} />
                                        </div>
                                        <button disabled={newPassLoading} type="submit" className="w-full bg-gray-900 hover:bg-black text-white font-bold py-3 rounded-lg transition-colors flex items-center justify-center gap-2">
                                            {newPassLoading ? 'Alterando...' : 'Salvar Nova Senha'}
                                        </button>
                                    </form>
                                </div>

                                {/* Formulario Novo Admin */}
                                <div className="bg-gradient-to-br from-emerald-900/5 to-primary/5 rounded-2xl shadow-sm border border-gray-100 p-8 relative overflow-hidden">
                                    <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                                        <UserPlus size={20} className="text-emerald-600"/> Cadastrar Novo Admin
                                    </h3>
                                    <form onSubmit={handleCreateAdmin} className="space-y-4 relative z-10">
                                        <div>
                                            <label className="block text-xs font-black uppercase text-gray-600 tracking-widest mb-1">Nome</label>
                                            <input type="text" required placeholder="Ex: Felipe Costa"
                                                className="w-full bg-white border border-gray-200 rounded-lg px-4 py-2 text-sm text-gray-900 focus:outline-none focus:border-emerald-500"
                                                value={adminForm.name} onChange={e => setAdminForm({...adminForm, name: e.target.value})} />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-black uppercase text-gray-600 tracking-widest mb-1">E-mail</label>
                                            <input type="email" required placeholder="admin@gca.com.br"
                                                className="w-full bg-white border border-gray-200 rounded-lg px-4 py-2 text-sm text-gray-900 focus:outline-none focus:border-emerald-500"
                                                value={adminForm.email} onChange={e => setAdminForm({...adminForm, email: e.target.value})} />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-black uppercase text-gray-600 tracking-widest mb-1">Senha (Mín 6)</label>
                                            <input type="password" required minLength="6"
                                                className="w-full bg-white border border-gray-200 rounded-lg px-4 py-2 text-sm text-gray-900 focus:outline-none focus:border-emerald-500"
                                                value={adminForm.password} onChange={e => setAdminForm({...adminForm, password: e.target.value})} />
                                        </div>
                                        <button disabled={adminFormLoading} type="submit" className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 rounded-lg transition-colors flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/30">
                                            {adminFormLoading ? 'Cadastrando no Supabase...' : 'Registrar Usuário'}
                                        </button>
                                    </form>
                                </div>
                            </div>

                            {/* Tabela de Admins Atuais */}
                            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
                                <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                                    <ShieldCheck size={20} className="text-gray-400"/> Lista de Administradores Cadastrados
                                </h3>
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left border-collapse">
                                        <thead>
                                            <tr className="border-b border-gray-100 uppercase text-[10px] font-black tracking-widest text-gray-400">
                                                <th className="pb-3 px-2">Nome</th>
                                                <th className="pb-3 px-2">E-mail (Login)</th>
                                                <th className="pb-3 px-2">Data de Criação</th>
                                                <th className="pb-3 px-2 text-right">Ações</th>
                                            </tr>
                                        </thead>
                                        <tbody className="text-sm border-b border-gray-100">
                                            {isInitialLoading ? (
                                                [1, 2].map(i => (
                                                    <tr key={i} className="border-b border-gray-50">
                                                        <td className="py-4 px-2">
                                                            <div className="flex items-center gap-2">
                                                                <Skeleton width="32px" height="32px" rounded="rounded-full" />
                                                                <Skeleton width="100px" height="16px" />
                                                            </div>
                                                        </td>
                                                        <td className="py-4 px-2"><Skeleton width="150px" height="16px" /></td>
                                                        <td className="py-4 px-2"><Skeleton width="80px" height="16px" /></td>
                                                        <td className="py-4 px-2"><Skeleton width="60px" height="16px" /></td>
                                                    </tr>
                                                ))
                                            ) : admins.map(admin => (
                                                <tr key={admin.id} className="hover:bg-gray-50 border-b border-gray-50 last:border-transparent transition-colors">
                                                    <td className="py-4 px-2 font-bold text-gray-800 flex items-center gap-2">
                                                        <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-primary font-black uppercase shrink-0">
                                                            {admin.name?.charAt(0) || '?'}
                                                        </div>
                                                        {admin.name}
                                                    </td>
                                                    <td className="py-4 px-2 font-mono text-gray-600">{admin.email}</td>
                                                    <td className="py-4 px-2 text-gray-400 font-medium">
                                                        {admin.createdAt ? new Date(admin.createdAt).toLocaleDateString('pt-BR') : 'Legado'}
                                                    </td>
                                                    <td className="py-4 px-2 text-right">
                                                        <div className="flex items-center justify-end gap-2">
                                                            {admin.email !== adminEmail && (
                                                                <>
                                                                    <button onClick={() => handleResetAdminPassword(admin.id, admin.name)} title="Resetar Senha"
                                                                        className="p-2 text-amber-500 hover:bg-amber-100 bg-amber-50 rounded transition-colors shadow-sm">
                                                                        <KeyRound size={16} />
                                                                    </button>
                                                                    <button onClick={() => handleDeleteAdmin(admin.id, admin.name)} title="Excluir Conta"
                                                                        className="p-2 text-red-500 hover:bg-red-100 bg-red-50 rounded transition-colors shadow-sm">
                                                                        <Trash2 size={16} />
                                                                    </button>
                                                                </>
                                                            )}
                                                            {admin.email === adminEmail && (
                                                                <span className="text-xs uppercase tracking-widest text-primary font-black bg-primary/10 px-2 py-1 rounded">Você</span>
                                                            )}
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                            {admins.length === 0 && (
                                                <tr>
                                                    <td colSpan="4" className="py-8 text-center text-gray-400 text-xs italic">
                                                        Nenhum admin adicional registrado manualmente no banco de dados.
                                                    </td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>

                        </div>
                    </FadeIn>
                )}
            </main>
        </div>
    );
};

export default AdminDashboard;
