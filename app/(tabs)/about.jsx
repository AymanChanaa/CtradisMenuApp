import { View, Text, Image, ScrollView } from "react-native";
import React from "react";
import { StatusBar } from "expo-status-bar";
import { SafeAreaView } from "react-native-safe-area-context";
import { images } from "../../constants";

const about = () => {
  return (
    <SafeAreaView className="bg-primary h-full">
      <ScrollView>
        <View className="items-center">
          <Image
            source={images.logo}
            className="w-[150] h-75 px-3"
            resizeMode="contain"
          />

          <Text className="text-orange-400 text-xl font-pbold">
            C-Tradis ( Groupe Capital Finance )
          </Text>
        </View>

        <View>
          <Text className="text-white mt-10 text-xl pr-3 text-right">
            شركة C-Tradis هي شركة تابعة لمجموعة Capital Finance، وهي شركة متخصصة
            في توزيع السلع الاستهلاكية (FMCG). نحن نحافظ على شراكات قوية مع
            الشركات متعددة الجنسيات والشركات الوطنية الرائدة في مجالها، بما في
            ذلك شركة يونيليفر، وصافولا، وسيلفر فود، وسنترال دانون (المنتجات
            المحيطة). ويمتد تواجدنا على طول القناة التقليدية التي تغطي أكثر من
            60% من الأراضي المغربية، من طنجة إلى الصويرة. يتكون فريقنا من 500
            موظف موزعين على جميع الأقسام، بما في ذلك المبيعات والخدمات اللوجستية
            والمالية. لقد قمنا بتنفيذ نظام تخطيط موارد المؤسسات (ERP) لأتمتة
            المبيعات والمحاسبة لدينا، بالإضافة إلى حلول تكنولوجيا المعلومات التي
            تسمح بالتحليل الفوري للبيانات (المبيعات، ومؤشرات الأداء الرئيسية
            النوعية، وما إلى ذلك). طموحنا هو أن يتم الاعتراف بنا كأفضل موزع في
            المغرب، ونعمل كل يوم لتحقيق هذا الهدف.
          </Text>
        </View>

        <View className="flex-col mb-3">
          <Text className="text-secondary-200 mt-10 text-2xl px-2 text-right">
            صناعة
          </Text>

          <Text className="text-white mt-1 text-lg pr-3 text-right">
            بيع المواد الغذائية والمشروبات بالتجزئة
          </Text>
        </View>

        <View className="flex-col mb-6">
          <Text className="text-secondary-200 mt-10 text-2xl px-2 text-right">
            تأسست
          </Text>

          <Text className="text-white mt-1 text-lg pr-3 text-right">2018</Text>
        </View>
      </ScrollView>

      <StatusBar backgroundColor="#161622" style="light" />
    </SafeAreaView>
  );
};

export default about;
