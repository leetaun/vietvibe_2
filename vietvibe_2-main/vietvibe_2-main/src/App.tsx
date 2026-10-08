import React, { useState, useEffect, useCallback } from 'react';
import { Header } from './components/common/Header';
import { HomeScreen } from './components/screens/HomeScreen';
import { ExploreScreen } from './components/screens/ExploreScreen';
import { CulturalDetailScreen } from './components/screens/CulturalDetailScreen';
import { SetupStylistScreen } from './components/screens/SetupStylistScreen';
import { OutfitBuilderScreen } from './components/screens/OutfitBuilderScreen';
import { CulturalCheckScreen } from './components/screens/CulturalCheckScreen';
import { TryOnScreen } from './components/screens/TryOnScreen';
import { TryOnResultScreen } from './components/screens/TryOnResultScreen';
import { LookbookScreen } from './components/screens/LookbookScreen';
import { ProfileHistoryScreen } from './components/screens/ProfileHistoryScreen';
import { AuthModal } from './components/screens/AuthModal';
import { AdminDashboardModal } from './components/screens/AdminDashboardModal';

import {
  CULTURAL_COSTUMES,
  EVENT_OPTIONS,
  STYLE_OPTIONS,
  SAMPLE_LOOKBOOKS,
  INITIAL_USER_HISTORY,
  INITIAL_USER_PROFILE
} from './data/mockData';
import {
  CulturalCardData,
  OutfitComponentSelection,
  LookbookAlbum,
  UserHistoryItem,
  UserProfile
} from './types/vietvibe';
import { type AIStatus, type CulturalAssessment } from './types/vietvibe';

async function callAI<T>(route: string, body: unknown, signal?: AbortSignal): Promise<T> {
  try {
    const response = await fetch('/api/ai/' + route, {
      method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body),
      signal: signal || AbortSignal.timeout(160_000),
    });
    if (!response.headers.get('content-type')?.includes('application/json')) {
      throw new Error('Cần khởi động server mới: dừng lệnh npm run dev cũ rồi chạy lại npm.cmd run dev.');
    }
    const data = await response.json();
    if (!response.ok) throw new Error(typeof data.error === 'string' ? data.error : 'Không nhận được kết quả từ Gemini.');
    return data as T;
  } catch (error) {
    if (error instanceof Error && ['TimeoutError', 'AbortError'].includes(error.name)) throw new Error('Yêu cầu AI đã dừng hoặc quá thời gian chờ.');
    if (error instanceof TypeError) throw new Error('Không kết nối được server. Kiểm tra terminal và chạy npm.cmd run dev.');
    throw error;
  }
}
function costumeContext(costume: CulturalCardData) {
  return { name: costume.name, dynasty: costume.dynasty, originHistory: costume.originHistory,
    prominentFeatures: costume.prominentFeatures, usageContext: costume.usageContext, culturalGuardrails: costume.culturalGuardrails };
}
async function referencePhoto(file: string, crop: [number, number, number, number]): Promise<string> {
  return new Promise((resolve, reject) => {
    const source = new Image();
    source.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = crop[2]; canvas.height = crop[3];
      const context = canvas.getContext('2d');
      if (!context) { reject(new Error('Trình duyệt không đọc được ảnh mẫu.')); return; }
      context.drawImage(source, ...crop, 0, 0, crop[2], crop[3]);
      resolve(canvas.toDataURL('image/png'));
    };
    source.onerror = () => reject(new Error('Không đọc được ảnh tham chiếu.'));
    source.src = '/' + file;
  });
}

export default function App() {
  // Navigation State
  const [currentTab, setCurrentTab] = useState<string>('home');
  const [previousTab, setPreviousTab] = useState<string>('home');

  // User Authentication State
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(true);
  const [userProfile, setUserProfile] = useState<UserProfile>(INITIAL_USER_PROFILE);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);
  const [isAdminModalOpen, setIsAdminModalOpen] = useState<boolean>(false);
  const [authPendingReason, setAuthPendingReason] = useState<string | undefined>(undefined);

  // Active Costume for Details
  const [selectedCostume, setSelectedCostume] = useState<CulturalCardData>(
    CULTURAL_COSTUMES[0] // Áo Nhật Bình
  );

  // Active Outfit Builder State
  const [currentOutfit, setCurrentOutfit] = useState<OutfitComponentSelection>({
    mainGarment: 'Áo Tấc',
    innerRobe: 'Bạch y (Cổ trắng)',
    pantsOrSkirt: 'Quần lụa trắng',
    headwear: 'Mấn xanh thời Nguyễn',
    footwear: 'Hài thêu hoa sen',
    accessories: ['acc-fan', 'acc-khanh'],
    colorTheme: '#16385C'
  });

  // User's uploaded Try-On image
  const [tryOnImage, setTryOnImage] = useState<string | null>(null);
  const [tryOnResultImage, setTryOnResultImage] = useState<string | null>(null);
  const [tryOnResultNote, setTryOnResultNote] = useState('');
  const [stylistExplanation, setStylistExplanation] = useState('');
  const [aiStatus, setAIStatus] = useState<AIStatus>({ configured: false, backendAvailable: false, checking: true });
  const refreshAIStatus = useCallback(async () => {
    setAIStatus(previous => ({ ...previous, checking: true }));
    try {
      const response = await fetch('/api/ai/status', { signal: AbortSignal.timeout(5000), cache: 'no-store' });
      if (!response.ok) throw new Error('Server unavailable');
      const data = await response.json();
      if (typeof data.configured !== 'boolean') throw new Error('Invalid status');
      setAIStatus({ configured: data.configured, backendAvailable: true, checking: false });
    } catch { setAIStatus({ configured: false, backendAvailable: false, checking: false }); }
  }, []);
  useEffect(() => {
    void refreshAIStatus();
    const refresh = () => { void refreshAIStatus(); };
    window.addEventListener('focus', refresh);
    return () => window.removeEventListener('focus', refresh);
  }, [refreshAIStatus]);

  // Lookbooks and History State
  const [lookbooks, setLookbooks] = useState<LookbookAlbum[]>(SAMPLE_LOOKBOOKS);
  const [historyList, setHistoryList] = useState<UserHistoryItem[]>(INITIAL_USER_HISTORY);

  // Navigation handler
  const handleNavigate = (tab: string, costumeId?: string) => {
    setPreviousTab(currentTab);
    if (costumeId) {
      const found = CULTURAL_COSTUMES.find(c => c.id === costumeId);
      if (found) setSelectedCostume(found);
    }
    setCurrentTab(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Cultural Detail handlers
  const handleSelectCostume = (costume: CulturalCardData) => {
    setSelectedCostume(costume);
    handleNavigate('cultural_detail');
  };

  const handleStartStylingFromCulture = (costume: CulturalCardData) => {
    setSelectedCostume(costume);
    setCurrentOutfit(prev => ({
      ...prev,
      mainGarment: costume.name,
      colorTheme: costume.themeColor
    }));
    handleNavigate('stylist_setup');
  };

  // AI Stylist Setup handler
  const handleGenerateOutfitFromSetup = (config: {
    event: string;
    style: string;
    colorHex: string;
    colorName: string;
    notes: string;
    costumeId: string;
  }) => {
    setStylistExplanation('Bản phối mẫu để xem giao diện.');
    const foundCostume = CULTURAL_COSTUMES.find(c => c.id === config.costumeId) || CULTURAL_COSTUMES[1];
    setSelectedCostume(foundCostume);

    setCurrentOutfit({
      mainGarment: foundCostume.name,
      innerRobe: 'Bạch y (Cổ trắng)',
      pantsOrSkirt: 'Quần lụa trắng',
      headwear: 'Mấn xanh thời Nguyễn',
      footwear: 'Hài thêu hoa sen',
      accessories: ['acc-fan', 'acc-khanh'],
      colorTheme: config.colorHex
    });

    // Add to history
    const newHistoryItem: UserHistoryItem = {
      id: `h-${Date.now()}`,
      timeString: 'Vừa xong',
      actionType: 'create_outfit',
      title: `Đã tạo bộ phối mới "${foundCostume.name}"`,
      detail: `Phong cách ${config.style}, tông màu ${config.colorName} cho sự kiện ${config.event}.`,
      thumbnailColor: config.colorHex,
      costumeName: foundCostume.name
    };
    setHistoryList(prev => [newHistoryItem, ...prev]);

    handleNavigate('outfit_builder');
  };

  const handleGeminiStylist = async (config: Parameters<typeof handleGenerateOutfitFromSetup>[0]) => {
    const costume = CULTURAL_COSTUMES.find(item => item.id === config.costumeId) || CULTURAL_COSTUMES[1];
    const base: OutfitComponentSelection = { mainGarment: costume.name, innerRobe: 'Bạch y (Cổ trắng)', pantsOrSkirt: 'Quần lụa trắng', headwear: 'Mấn xanh thời Nguyễn', footwear: 'Hài thêu hoa sen', accessories: ['acc-fan', 'acc-khanh'], colorTheme: config.colorHex };
    const result = await callAI<{ outfit: OutfitComponentSelection; explanation: string }>('stylist', {
      outfit: base, costume: costumeContext(costume),
      preferences: { event: EVENT_OPTIONS.find(item => item.id === config.event)?.label || config.event,
        style: STYLE_OPTIONS.find(item => item.id === config.style)?.label || config.style, notes: config.notes },
    });
    setSelectedCostume(costume); setCurrentOutfit(result.outfit); setStylistExplanation(result.explanation);
    setHistoryList(previous => [{ id: 'h-' + Date.now(), timeString: 'Vừa xong', actionType: 'create_outfit', title: 'Gemini gợi ý bộ phối "' + costume.name + '"', detail: result.explanation, thumbnailColor: result.outfit.colorTheme, costumeName: costume.name, outfit: result.outfit }, ...previous]);
    handleNavigate('outfit_builder');
  };
  const handleAnalyzeOutfit = async (signal?: AbortSignal) => {
    const costume = CULTURAL_COSTUMES.find(item => item.name === currentOutfit.mainGarment) || selectedCostume;
    return callAI<CulturalAssessment>('cultural-check', { outfit: currentOutfit, costume: costumeContext(costume) }, signal);
  };

  // Outfit Builder actions
  const handleProceedToCulturalCheck = (outfit: OutfitComponentSelection) => {
    setCurrentOutfit(outfit);
    handleNavigate('cultural_check');
  };

  const handleProceedToTryOn = (outfit: OutfitComponentSelection) => {
    setCurrentOutfit(outfit);
    handleNavigate('tryon');
  };

  // Cultural Check actions
  const handleAutoFixCulturalConflicts = (suggested?: OutfitComponentSelection) => {
    if (suggested) { setCurrentOutfit(suggested); return; }
    setCurrentOutfit(prev => ({
      ...prev,
      footwear: 'Hài thêu hoa sen',
      accessories: prev.accessories
        .filter(a => a !== 'acc-sneaker' && a !== 'acc-sunglasses')
        .filter((a, index, items) => items.indexOf(a) === index)
        .concat(prev.accessories.includes('acc-fan') ? [] : ['acc-fan'])
    }));
  };

  const handleProceedAfterCulturalCheck = () => {
    handleNavigate('tryon');
  };

  // Try-On actions
  const handleExecuteTryOn = (userImageSrc: string, customAccessory?: string) => {
    setTryOnResultImage(null); setTryOnResultNote('');
    setTryOnImage(userImageSrc);

    // Record history
    const newHistoryItem: UserHistoryItem = {
      id: `h-${Date.now()}`,
      timeString: 'Vừa xong',
      actionType: 'try_on',
      title: `Đã xem bản mẫu thử đồ "${currentOutfit.mainGarment}"`,
      detail: customAccessory
        ? `Xem giao diện với phụ kiện "${customAccessory}". Chưa kết nối API.`
        : 'Xem bản minh họa giao diện, chưa có kết quả từ API try-on.',
      thumbnailColor: currentOutfit.colorTheme,
      costumeName: currentOutfit.mainGarment
    };
    setHistoryList(prev => [newHistoryItem, ...prev]);

    handleNavigate('tryon_result');
  };
  const handleGeminiTryOn = async (userImageSrc: string, _accessoryName?: string, accessoryImage?: string) => {
    let personImage = userImageSrc;
    if (!personImage.startsWith('data:image/')) {
      const index = Number(personImage.replace('face-', '')) - 1;
      if (!Number.isInteger(index) || index < 0 || index > 3) throw new Error('Bạn cần chọn ảnh bản thân.');
      personImage = await referencePhoto('tryon-reference.png', [[89, 139, 189, 239][index], 470, 49, 52]);
    }
    const costume = CULTURAL_COSTUMES.find(item => item.name === currentOutfit.mainGarment) || selectedCostume;
    const garmentImage = costume.image || await referencePhoto('explore-reference.png', [84, 200, 133, 137]);
    const result = await callAI<{ image: string; note: string }>('try-on', { outfit: currentOutfit, personImage, garmentImage, accessoryImage });
    setCurrentOutfit(currentOutfit);
    setTryOnImage(personImage); setTryOnResultImage(result.image); setTryOnResultNote(result.note);
    setUserProfile(previous => ({ ...previous, tryOnCount: previous.tryOnCount + 1 }));
    setHistoryList(previous => [{ id: 'h-' + Date.now(), timeString: 'Vừa xong', actionType: 'try_on', title: 'Đã thử đồ bằng Gemini "' + currentOutfit.mainGarment + '"', detail: result.note, thumbnailColor: currentOutfit.colorTheme, costumeName: currentOutfit.mainGarment, outfit: currentOutfit, originalImage: personImage, resultImage: result.image, resultNote: result.note }, ...previous]);
    handleNavigate('tryon_result');
  };

  // Save to Lookbook action (with Guest auth gate)
  const handleSaveToLookbook = (authenticated = false) => {
    if (!isLoggedIn && !authenticated) {
      setAuthPendingReason('Đăng nhập để lưu bộ phối này vào Lookbook cá nhân và giữ nguyên bản phối hiện tại.');
      setIsAuthModalOpen(true);
      return;
    }

    // An edited draft must not inherit an image from an earlier try-on.
    const savedImage = currentTab === 'tryon_result' ? tryOnResultImage || undefined : undefined;
    // Add outfit to the first lookbook
    setLookbooks(prev => {
      const updated = [...prev];
      if (updated.length > 0) {
        updated[0] = {
          ...updated[0],
          outfitCount: updated[0].outfitCount + 1,
          outfits: [
            {
              image: savedImage,
              name: currentOutfit.mainGarment,
              dynasty: CULTURAL_COSTUMES.find(item => item.name === currentOutfit.mainGarment)?.dynasty || 'Chưa xác định',
              details: `Màu chủ đạo ${currentOutfit.colorTheme}, ${currentOutfit.headwear}, ${currentOutfit.footwear}.`
            },
            ...updated[0].outfits
          ]
        };
      } else {
        updated.push({id: `lb-${Date.now()}`, title: 'Bộ phối của tôi', occasion: 'Cá nhân', description: 'Những bộ phối đã lưu.', outfitCount: 1, coverImageTheme: currentOutfit.colorTheme, tags: ['Cá nhân'], outfits: [{image: savedImage, name: currentOutfit.mainGarment, dynasty: selectedCostume.dynasty, details: `Màu chủ đạo ${currentOutfit.colorTheme}.`}]});
      }
      return updated;
    });

    setUserProfile(prev => ({ ...prev, outfitCount: prev.outfitCount + 1 }));
  };

  // Authentication callbacks
  const handleLoginSuccess = (name: string, email: string) => {
    setIsLoggedIn(true);
    setUserProfile(prev => ({
      ...prev,
      name,
      email
    }));
    setIsAuthModalOpen(false);
    setAuthPendingReason(undefined);

    // If they were on try-on result and pressed save, save it now!
    if (authPendingReason?.startsWith('Đăng nhập để lưu bộ phối này')) {
      handleSaveToLookbook(true);
    }
  };

  const handleContinueAsGuest = () => {
    setIsLoggedIn(false);
    setIsAuthModalOpen(false);
    setAuthPendingReason(undefined);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setCurrentTab('home');
  };

  const handleCreateLookbookAlbum = (album: LookbookAlbum) => {
    setLookbooks(prev => [album, ...prev]);
    setUserProfile(prev => ({ ...prev, lookbookCount: prev.lookbookCount + 1 }));
  };

  const handleDeleteHistory = (id: string) => {
    setHistoryList(prev => prev.filter(item => item.id !== id));
  };

  const handleReopenHistory = (item: UserHistoryItem) => {
    const found = CULTURAL_COSTUMES.find(c => c.name.toLowerCase().includes(item.costumeName.toLowerCase()));
    if (found) {
      setSelectedCostume(found);
      setCurrentOutfit(prev => ({ ...prev, mainGarment: found.name, colorTheme: found.themeColor }));
    }
    if (item.actionType === 'view_culture') {
      handleNavigate('cultural_detail');
    } else if (item.actionType === 'save_lookbook') {
      handleNavigate('lookbook');
    } else if (item.actionType === 'try_on') {
      if (item.outfit) setCurrentOutfit(item.outfit);
      setTryOnImage(item.originalImage || null);
      setTryOnResultImage(item.resultImage || null);
      setTryOnResultNote(item.resultNote || '');
      handleNavigate('tryon_result');
    } else {
      if (item.outfit) setCurrentOutfit(item.outfit);
      handleNavigate('outfit_builder');
    }
  };

  const handleUpdateProfile = (name: string, email: string) => {
    setUserProfile(prev => ({ ...prev, name, email }));
  };

  const isStandaloneScreen = !['home', 'explore'].includes(currentTab);
  return (
    <div
      className="vv-app min-h-screen text-slate-100 flex flex-col selection:bg-amber-500/30 selection:text-amber-200"
      style={{
        backgroundColor:
          currentTab === 'tryon_result' ? '#F8F8F6' : currentTab === 'tryon' ? '#E5E5E5' : isStandaloneScreen ? '#11110F' : '#0B131E',
      }}
    >
      {/* 1. Header (Sticky Top Bar) */}
      {!isStandaloneScreen && (
        <Header
          currentTab={currentTab}
          onNavigate={handleNavigate}
          isLoggedIn={isLoggedIn}
          userName={userProfile.name}
          onOpenAuth={() => {
            setAuthPendingReason(undefined);
            setIsAuthModalOpen(true);
          }}
          onOpenAdmin={() => setIsAdminModalOpen(true)}
        />
      )}

      {/* Guest Mode Indicator Banner if browsing as Guest */}
      {!isLoggedIn && (
        <div className="bg-amber-950/40 border-b border-amber-500/30 px-4 py-2 text-center text-xs text-amber-200 flex items-center justify-center gap-2">
          <span>👀 Bạn đang trải nghiệm với tư cách <strong>Khách (Guest)</strong>. Bạn có thể tự do phối đồ, khám phá thẻ văn hóa và thử đồ ảo.</span>
          <button
            onClick={() => {
              setAuthPendingReason('Đăng nhập để lưu trữ các bộ phối và đồng bộ trên mọi thiết bị.');
              setIsAuthModalOpen(true);
            }}
            className="underline font-bold text-amber-300 hover:text-white ml-1 cursor-pointer"
          >
            Đăng nhập ngay
          </button>
        </div>
      )}

      {/* 2. Main Content Viewport */}
      <main
        className={`flex-1 w-full mx-auto ${
          currentTab === 'cultural_detail'
            ? 'max-w-[1024px] px-4 sm:px-8 pt-0'
            : isStandaloneScreen
              ? 'max-w-[1024px] px-0 pt-0'
            : currentTab === 'home'
              ? 'max-w-7xl px-4 sm:px-[5%] pt-3.5'
              : 'max-w-7xl px-4 sm:px-6 lg:px-8 pt-6'
        }`}
      >
        {/* SCREEN 1: Home (Trang chủ - PDF Page 1) */}
        {currentTab === 'home' && (
          <HomeScreen
            onNavigate={handleNavigate}
            onSelectCostume={handleSelectCostume}
          />
        )}

        {/* SCREEN 2: Explore (Khám phá - PDF Page 2) */}
        {currentTab === 'explore' && (
          <ExploreScreen
            onSelectCostume={handleSelectCostume}
            onStartStylingWithCostume={handleStartStylingFromCulture}
          />
        )}

        {/* SCREEN 3: Cultural Detail (Chi tiết Việt phục - PDF Page 3) */}
        {currentTab === 'cultural_detail' && (
          <CulturalDetailScreen
            costume={selectedCostume}
            onBack={() => handleNavigate(previousTab === 'cultural_detail' ? 'explore' : previousTab)}
            onStartStyling={handleStartStylingFromCulture}
          />
        )}

        {/* SCREEN 4: Setup Stylist (Thiết lập phối đồ - PDF Page 4) */}
        {currentTab === 'stylist_setup' && (
          <SetupStylistScreen
            onBack={() => handleNavigate('home')}
            initialCostume={selectedCostume}
            aiStatus={aiStatus}
            onRefreshAI={refreshAIStatus}
            onGenerateOutfit={handleGeminiStylist}
            onPreviewOutfit={handleGenerateOutfitFromSetup}
          />
        )}

        {/* SCREEN 5: Outfit Builder (AI Gợi ý & Tùy chỉnh Outfit - PDF Page 5) */}
        {currentTab === 'outfit_builder' && (
          <OutfitBuilderScreen
            onBack={() => handleNavigate('stylist_setup')}
            initialOutfit={currentOutfit}
            aiExplanation={stylistExplanation}
            initialConfig={{
              costumeId: selectedCostume.id,
              colorHex: currentOutfit.colorTheme
            }}
            onProceedToCulturalCheck={handleProceedToCulturalCheck}
            onProceedToTryOn={handleProceedToTryOn}
            onSaveOutfitToDraft={(outfit) => setCurrentOutfit(outfit)}
          />
        )}

        {/* SCREEN 6: Cultural Check (Kiểm tra tính phù hợp văn hóa - PDF Page 6) */}
        {currentTab === 'cultural_check' && (
          <CulturalCheckScreen
            outfit={currentOutfit}
            aiStatus={aiStatus}
            onRefreshAI={refreshAIStatus}
            onAnalyze={handleAnalyzeOutfit}
            onAutoFix={handleAutoFixCulturalConflicts}
            onProceedAnyway={handleProceedAfterCulturalCheck}
            onBackToBuilder={() => handleNavigate('outfit_builder')}
          />
        )}

        {/* SCREEN 7: Try-On (Tải ảnh thử đồ - PDF Page 7) */}
        {currentTab === 'tryon' && (
          <TryOnScreen
            onBack={() => handleNavigate('outfit_builder')}
            aiStatus={aiStatus}
            onRefreshAI={refreshAIStatus}
            onExecuteTryOn={handleGeminiTryOn}
            onPreviewTryOn={handleExecuteTryOn}
          />
        )}

        {/* SCREEN 8: Try-On Result (Kết quả mặc thử ảo - PDF Page 8) */}
        {currentTab === 'tryon_result' && (
          <TryOnResultScreen
            outfit={currentOutfit}
            userImage={tryOnImage}
            generatedImage={tryOnResultImage}
            resultNote={tryOnResultNote}
            onSaveToLookbook={() => handleSaveToLookbook()}
            onTryAgain={() => handleNavigate('tryon')}
            isLoggedIn={isLoggedIn}
          />
        )}

        {/* SCREEN 9: Lookbook (Lookbook cá nhân - PDF Page 9) */}
        {currentTab === 'lookbook' && (
          <LookbookScreen
            onBack={() => handleNavigate('home')}
            onUpdateAlbum={(album) => setLookbooks(prev => prev.map(item => item.id === album.id ? album : item))}
            albums={lookbooks}
            onCreateAlbum={handleCreateLookbookAlbum}
            isLoggedIn={isLoggedIn}
            onOpenAuth={() => {
              setAuthPendingReason('Đăng nhập để tạo và quản lý Lookbook cá nhân của bạn.');
              setIsAuthModalOpen(true);
            }}
          />
        )}

        {/* SCREEN 10: Profile & History (Hồ sơ & Lịch sử - PDF Page 10) */}
        {currentTab === 'profile' && (
          <ProfileHistoryScreen
            onBack={() => handleNavigate('home')}
            onOpenAdmin={() => setIsAdminModalOpen(true)}
            user={userProfile}
            history={historyList}
            onDeleteHistory={handleDeleteHistory}
            onReopenHistory={handleReopenHistory}
            onLogout={handleLogout}
            onUpdateProfile={handleUpdateProfile}
          />
        )}
      </main>

      {/* 3. Subtle Heritage Footer */}
      <footer
        className={
          isStandaloneScreen
            ? 'hidden'
            : 'border-t border-slate-900 bg-[#070D15] py-8 text-center text-xs text-slate-500'
        }
      >
        <div className="max-w-7xl mx-auto px-4 space-y-2">
          <div className="flex items-center justify-center gap-2 text-slate-400 font-medium">
            <span className="font-serif-culture text-amber-400">VietVibe</span>
            <span>·</span>
            <span>Việt Phục AI Stylist</span>
            <span>·</span>
            <span>Gìn giữ bản sắc di sản dân tộc</span>
          </div>
          <p className="text-[11px] text-slate-600">
            Nguồn tư liệu tham chiếu: Khảo cứu trang phục triều Lý, Trần, Lê, Nguyễn & Tiêu chuẩn số hóa di sản.
          </p>
        </div>
      </footer>

      {/* Auth Modal (Login / Register / Guest) */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onLoginSuccess={handleLoginSuccess}
        onContinueAsGuest={handleContinueAsGuest}
        pendingActionNote={authPendingReason}
      />

      {/* Admin Dashboard Modal (Document 1 & 2 Spec) */}
      <AdminDashboardModal
        isOpen={isAdminModalOpen}
        onClose={() => setIsAdminModalOpen(false)}
      />
    </div>
  );
}
