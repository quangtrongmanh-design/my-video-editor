import React, { useState } from "react";
import {
  Alert, SafeAreaView, ScrollView, StatusBar, StyleSheet, Text,
  TouchableOpacity, View
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { useVideoPlayer, VideoView } from "expo-video";
import { StatusBar as ExpoStatusBar } from "expo-status-bar";
import { adManager } from "./src/ads";
import VideoTrim, { showEditor } from "react-native-video-trim";

type PickedVideo = { uri: string; fileName?: string | null; duration?: number | null };

function Action({ icon, label, onPress }: { icon: string; label: string; onPress: () => void }) {
  return (
    <TouchableOpacity style={styles.action} onPress={onPress} activeOpacity={0.8}>
      <Text style={styles.actionIcon}>{icon}</Text>
      <Text style={styles.actionText}>{label}</Text>
    </TouchableOpacity>
  );
}

function BannerPlaceholder() {
  const [title, setTitle] = useState("Khu vực quảng cáo riêng của bạn");
  React.useEffect(() => {
    adManager.getAd("home_banner").then(ad => {
      if (ad) setTitle(ad.title);
    }).catch(() => {});
  }, []);
  return (
    <View style={styles.adBanner}>
      <Text style={styles.adTag}>QUẢNG CÁO</Text>
      <Text style={styles.adText}>{title}</Text>
      <Text style={styles.adSub}>Có thể thay bằng chiến dịch của bạn hoặc mạng quảng cáo sau này</Text>
    </View>
  );
}

export default function App() {
  const [video, setVideo] = useState<PickedVideo | null>(null);
  const [tab, setTab] = useState<"edit" | "projects" | "settings">("edit");
  const [lastExport, setLastExport] = useState<string | null>(null);

  React.useEffect(() => {
    const subscription = VideoTrim.onFinishTrimming(({ outputPath }) => {
      const uri = outputPath.startsWith("file://") ? outputPath : `file://${outputPath}`;
      setLastExport(uri);
      setVideo({ uri, fileName: "VIPStudio_video_da_cat.mp4" });
      Alert.alert("Đã cắt video", "Video mới đã được tạo. Anh có thể xem lại trong khung xem trước.");
    });
    return () => subscription.remove();
  }, []);
  const player = useVideoPlayer(video?.uri ?? null, p => {
    p.pause();
  });

  const chooseVideo = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["videos"],
      allowsEditing: false,
      quality: 1
    });
    if (!result.canceled && result.assets?.[0]) {
      const asset = result.assets[0];
      setVideo({ uri: asset.uri, fileName: asset.fileName, duration: asset.duration });
    }
  };

  const openTrimEditor = () => {
    if (!video) {
      Alert.alert("Chưa có video", "Anh hãy chọn video từ điện thoại trước nha.");
      return;
    }
    try {
      showEditor(video.uri, { saveToPhoto: true });
    } catch (error) {
      Alert.alert("Chưa mở được trình cắt", "Hãy cài đặt gói native và chạy bản development/build của ứng dụng. Tính năng này không chạy trong Expo Go.");
    }
  };

  const featureNotReady = (feature: string) => {
    Alert.alert(
      feature,
      "Đây là bản khung khởi đầu. Công cụ này sẽ được nối với bộ xử lý video thật ở giai đoạn tiếp theo."
    );
  };

  return (
    <SafeAreaView style={styles.safe}>
      <ExpoStatusBar style="light" />
      <StatusBar barStyle="light-content" />
      <View style={styles.header}>
        <View>
          <Text style={styles.eyebrow}>VIDEO CREATOR</Text>
          <Text style={styles.logo}>VIP <Text style={styles.logoAccent}>STUDIO</Text></Text>
        </View>
        <View style={styles.freePill}><Text style={styles.freeText}>MIỄN PHÍ</Text></View>
      </View>

      <View style={styles.tabs}>
        {(["edit", "projects", "settings"] as const).map((item) => (
          <TouchableOpacity key={item} onPress={() => setTab(item)} style={[styles.tab, tab === item && styles.tabActive]}>
            <Text style={[styles.tabText, tab === item && styles.tabTextActive]}>
              {item === "edit" ? "Biên tập" : item === "projects" ? "Dự án" : "Cài đặt"}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {tab === "edit" && (
          <>
            <View style={styles.sectionHeading}>
              <Text style={styles.h1}>Tạo video mới</Text>
              <Text style={styles.muted}>Biến khoảnh khắc thành câu chuyện</Text>
            </View>
            <TouchableOpacity style={styles.importCard} onPress={chooseVideo} activeOpacity={0.85}>
              <Text style={styles.importIcon}>＋</Text>
              <Text style={styles.importTitle}>{video ? "Chọn video khác" : "Chọn video từ điện thoại"}</Text>
              <Text style={styles.muted}>MP4 và các định dạng được thiết bị hỗ trợ</Text>
            </TouchableOpacity>

            {video ? (
              <View style={styles.previewWrap}>
                <VideoView player={player} style={styles.preview} nativeControls contentFit="contain" />
                <Text style={styles.fileName}>{video.fileName || "Video đã chọn"}</Text>
                {lastExport ? <Text style={styles.exportNotice}>✓ Video đã cắt được tạo và lưu vào thư viện (nếu quyền thiết bị cho phép).</Text> : null}
              </View>
            ) : (
              <View style={styles.previewEmpty}>
                <Text style={styles.playSymbol}>▶</Text>
                <Text style={styles.muted}>Bản xem trước video sẽ xuất hiện tại đây</Text>
              </View>
            )}

            <Text style={styles.sectionTitle}>Công cụ chỉnh sửa</Text>
            <View style={styles.toolGrid}>
              <Action icon="✂️" label="Cắt video" onPress={openTrimEditor} />
              <Action icon="▧" label="Ghép clip" onPress={() => featureNotReady("Ghép clip")} />
              <Action icon="T" label="Thêm chữ" onPress={() => featureNotReady("Thêm chữ")} />
              <Action icon="♫" label="Âm nhạc" onPress={() => featureNotReady("Âm nhạc")} />
              <Action icon="✦" label="Hiệu ứng" onPress={() => featureNotReady("Hiệu ứng")} />
              <Action icon="◐" label="Bộ lọc màu" onPress={() => featureNotReady("Bộ lọc màu")} />
              <Action icon="⇄" label="Chuyển cảnh" onPress={() => featureNotReady("Chuyển cảnh")} />
              <Action icon="↗" label="Xuất video" onPress={() => featureNotReady("Xuất video")} />
            </View>
            <BannerPlaceholder />
            <Text style={styles.note}>Bản phát triển: chức năng cắt mở trình biên tập native và nhận đường dẫn video kết quả. Ghép clip, chữ, nhạc, hiệu ứng, lưu dự án và SDK quảng cáo thật vẫn đang chờ tích hợp.</Text>
          </>
        )}

        {tab === "projects" && (
          <View style={styles.sectionHeading}>
            <Text style={styles.h1}>Dự án của tôi</Text>
            <Text style={styles.muted}>Danh sách dự án và lưu tự động sẽ được bổ sung ở giai đoạn tiếp theo.</Text>
            <TouchableOpacity style={styles.primaryButton} onPress={() => { setTab("edit"); chooseVideo(); }}>
              <Text style={styles.primaryButtonText}>＋ Tạo dự án</Text>
            </TouchableOpacity>
          </View>
        )}

        {tab === "settings" && (
          <View style={styles.sectionHeading}>
            <Text style={styles.h1}>Cài đặt ứng dụng</Text>
            <View style={styles.settingRow}><Text style={styles.settingTitle}>Ngôn ngữ</Text><Text style={styles.muted}>Tiếng Việt</Text></View>
            <View style={styles.settingRow}><Text style={styles.settingTitle}>Mô hình</Text><Text style={styles.muted}>Miễn phí có quảng cáo</Text></View>
            <View style={styles.settingRow}><Text style={styles.settingTitle}>Quảng cáo riêng</Text><Text style={styles.status}>Đã có khung tích hợp</Text></View>
            <View style={styles.settingRow}><Text style={styles.settingTitle}>Mạng quảng cáo</Text><Text style={styles.muted}>Chưa kết nối SDK</Text></View>
            <Text style={styles.note}>Không có doanh thu quảng cáo thật cho đến khi kết nối tài khoản và SDK của nhà cung cấp.</Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#101114" },
  header: { paddingHorizontal: 20, paddingTop: 12, paddingBottom: 18, flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  eyebrow: { color: "#9EA1AC", fontSize: 10, letterSpacing: 3, fontWeight: "700" },
  logo: { color: "#FFFFFF", fontSize: 26, fontWeight: "900", letterSpacing: 1 },
  logoAccent: { color: "#F7B844" },
  freePill: { borderWidth: 1, borderColor: "#F7B844", borderRadius: 20, paddingHorizontal: 11, paddingVertical: 7 },
  freeText: { color: "#F7B844", fontSize: 10, fontWeight: "800", letterSpacing: 1 },
  tabs: { flexDirection: "row", marginHorizontal: 16, backgroundColor: "#1A1B20", borderRadius: 12, padding: 4, marginBottom: 12 },
  tab: { flex: 1, paddingVertical: 11, alignItems: "center", borderRadius: 9 },
  tabActive: { backgroundColor: "#343036" },
  tabText: { color: "#9295A0", fontWeight: "600" },
  tabTextActive: { color: "#FFFFFF" },
  content: { paddingHorizontal: 18, paddingBottom: 36 },
  sectionHeading: { marginTop: 10, marginBottom: 16 },
  h1: { color: "#FFFFFF", fontSize: 23, fontWeight: "800", marginBottom: 5 },
  muted: { color: "#9295A0", fontSize: 12, lineHeight: 18 },
  importCard: { borderWidth: 1, borderColor: "#5B4727", borderStyle: "dashed", borderRadius: 18, padding: 20, alignItems: "center", backgroundColor: "#201D18" },
  importIcon: { color: "#F7B844", fontSize: 34, fontWeight: "300", marginBottom: 7 },
  importTitle: { color: "#FFFFFF", fontWeight: "700", fontSize: 15, marginBottom: 5 },
  previewEmpty: { height: 190, backgroundColor: "#1A1B20", borderRadius: 16, marginTop: 14, alignItems: "center", justifyContent: "center", gap: 10 },
  playSymbol: { color: "#F7B844", fontSize: 30 },
  previewWrap: { marginTop: 14, backgroundColor: "#1A1B20", borderRadius: 16, padding: 8 },
  preview: { height: 210, width: "100%", backgroundColor: "#000", borderRadius: 10 },
  fileName: { color: "#E6E6E8", fontSize: 12, padding: 8 },
  sectionTitle: { color: "#FFFFFF", fontWeight: "800", fontSize: 17, marginTop: 24, marginBottom: 12 },
  toolGrid: { flexDirection: "row", flexWrap: "wrap", justifyContent: "space-between" },
  action: { width: "23.5%", minHeight: 84, borderRadius: 13, backgroundColor: "#1D1E23", alignItems: "center", justifyContent: "center", marginBottom: 9, paddingHorizontal: 3 },
  actionIcon: { color: "#F7B844", fontSize: 23, fontWeight: "700", marginBottom: 7 },
  actionText: { color: "#E7E7EB", fontSize: 10, fontWeight: "600", textAlign: "center" },
  adBanner: { marginTop: 16, borderRadius: 13, borderWidth: 1, borderColor: "#34343A", backgroundColor: "#191A1F", padding: 14 },
  adTag: { color: "#F7B844", fontSize: 9, fontWeight: "800", letterSpacing: 1.5, marginBottom: 7 },
  adText: { color: "#FFFFFF", fontSize: 14, fontWeight: "700", marginBottom: 5 },
  adSub: { color: "#9295A0", fontSize: 11, lineHeight: 16 },
  note: { color: "#777B86", fontSize: 11, lineHeight: 17, marginTop: 16 },
  primaryButton: { backgroundColor: "#F7B844", padding: 14, borderRadius: 12, alignItems: "center", marginTop: 20 },
  primaryButtonText: { color: "#161616", fontWeight: "800" },
  settingRow: { borderBottomWidth: 1, borderBottomColor: "#2A2B31", paddingVertical: 16, gap: 5 },
  settingTitle: { color: "#FFFFFF", fontWeight: "700", fontSize: 14 },
  status: { color: "#70D6A3", fontSize: 12 },
  exportNotice: { color: "#70D6A3", fontSize: 11, lineHeight: 16, paddingHorizontal: 8, paddingBottom: 8 }
});
