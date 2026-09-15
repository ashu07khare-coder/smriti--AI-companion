import { LanguageCode, Reminder, FamilyMember, Story, StoryCategory } from '../types';

// ============================================================================
// 1. STORY LOCALIZATION (SECTIONS, STORIES, REGIONS, UI STRINGS)
// ============================================================================

export interface LocalizedSectionInfo {
  name: string;
  shortName: string;
  description: string;
}

const SECTION_TRANSLATIONS: Record<LanguageCode, Record<StoryCategory, LocalizedSectionInfo>> = {
  as: {
    'Historical Fiction / Folk-History': {
      name: 'ঐতিহাসিক কথা আৰু লোক-ইতিহাস',
      shortName: 'ঐতিহাসিক / লোক-ইতিহাস',
      description: 'নদীৰ যুদ্ধ, ৰাজপ্ৰসাদ, পৱিত্ৰ শিলৰ স্তম্ভ আৰু পূৰ্বপুৰুষৰ সাহসৰ গাথা।',
    },
    'Atmospheric Mystery / Thriller': {
      name: 'ৰহস্যময় আৰু শিহৰণকাৰী',
      shortName: 'ৰহস্যময় কাহিনী',
      description: 'নিশাৰ কুঁৱলী, বাঁহীৰ সুৰ, ওপঙা দ্বীপ আৰু পাহাৰৰ ৰহস্যময় পোহৰ।',
    },
    'Heartwarming & Emotional': {
      name: 'হৃদয়স্পৰ্শী আৰু আবেগিক',
      shortName: 'হৃদয়স্পৰ্শী',
      description: 'প্ৰজন্মৰ পাট-মুগা বোৱা তাঁতশাল, পুৱাৰ উমাল চাহ আৰু স্মৃতিভৰা চিঠি।',
    },
    'Folk-Wisdom': {
      name: 'লোক-জ্ঞান আৰু প্ৰজ্ঞা',
      shortName: 'লোক-জ্ঞান',
      description: 'জীৱন্ত শিপাৰ দলং, অংশীদাৰিত্বৰ সাধু আৰু অভিজ্ঞ বুঢ়া-মেথাৰ চিৰন্তন জ্ঞান।',
    },
  },
  brx: {
    'Historical Fiction / Folk-History': {
      name: 'जारौमिनारि / लोक-जारौमिन',
      shortName: 'जारौमिनारि',
      description: 'दैमायारि दावहा, राजदरबार, गाहाम अन्थाइ आरो आबौ-आबैमोननि साहसि राव।',
    },
    'Atmospheric Mystery / Thriller': {
      name: 'गोगोम रहस्य / थ्रिलर',
      shortName: 'गोगोम रहस्य',
      description: 'हरखाबनि खुकुं, सिफुंनि सुं, बिलोनि थाफ्ला आरो हाजोनि मोब्लिब सोरां।',
    },
    'Heartwarming & Emotional': {
      name: 'गोसो बोरखांखांनाय',
      shortName: 'गोसो बोरखां',
      description: 'नखरनि खुन दानाय, फुंनि गोदुं साहा आरो गोसोखां मोन्थाइ बिलाइ।',
    },
    'Folk-Wisdom': {
      name: 'गामि-गोहो आरो गियान',
      shortName: 'गामि गियान',
      description: 'थांना थानाय रोदनि दालां, राननायनि सल’ आरो आबौमोननि सोलोंथाइ।',
    },
  },
  mni: {
    'Historical Fiction / Folk-History': {
      name: 'পুৱারীগী খোঞ্জেল / লোক-ইতিহাস',
      shortName: 'পুৱারীগী খোঞ্জেল',
      description: 'তুরেলগী লানফম, নিংথৌ কোনুং, শেংলবা নুংপাক অমসুং ইপা-ইপুগী থৌনা।',
    },
    'Atmospheric Mystery / Thriller': {
      name: 'মায় ওনব থৌদোক / থ্রিলার',
      shortName: 'মায় ওনব থৌদোক',
      description: 'অহিংগী লৈচিল, খোংলৌগী খোঞ্জেল, ফুমদি লৈবাক অমসুং চীংগী নুংশিৎ।',
    },
    'Heartwarming & Emotional': {
      name: 'পুক্নিং হুরগা খোংথোকপা',
      shortName: 'পুক্নিং হুরগা',
      description: 'চারোন-শুরুন্না য়োংখাম শাবা, অয়ুক্কী চী অমসুং নুংশিরবা চিঠি।',
    },
    'Folk-Wisdom': {
      name: 'লোকেল লৌশিং অমসুং পুকচেল',
      shortName: 'লোকেল লৌশিং',
      description: 'হিংলিবা মরালগী থোং, তান্না চাবা অমসুং অহন-লমনগী পুকচেল।',
    },
  },
  lus: {
    'Historical Fiction / Folk-History': {
      name: 'Thawnthu Hluan / Hmasang Chanchin',
      shortName: 'Hmasang Chanchin',
      description: 'Luipui ral do, lalphung in, lungphun thianghlim leh pi pute huaisenna.',
    },
    'Atmospheric Mystery / Thriller': {
      name: 'Thuruk Chanchin Mak',
      shortName: 'Thuruk Chanchin',
      description: 'Zan chhum chhah tak, rawtling ri, dil chung thliarkar leh tlang chung eng.',
    },
    'Heartwarming & Emotional': {
      name: 'Rilru Khawih Chanchin',
      shortName: 'Rilru Khawih',
      description: 'Chhungkua puantah inlungrual, zing thingpui sa leh hmangaih lehkhathawn.',
    },
    'Folk-Wisdom': {
      name: 'Mizo Fingna leh Thawnthu',
      shortName: 'Fingna',
      description: 'Thing zung lei lawng, insemzai zirtirna leh upate thurawn hlu.',
    },
  },
  kha: {
    'Historical Fiction / Folk-History': {
      name: 'Ka Khana Pateng / Jingiathuhkhana',
      shortName: 'Khana Pateng',
      description: 'Ki thma wahbah, ki iing syiem, ki mawbynna bad ka shlur ki kpa tymmen.',
    },
    'Atmospheric Mystery / Thriller': {
      name: 'Ka Jingma / Jingphylla',
      shortName: 'Jingma Phylla',
      description: 'U lyoh miet, ka besli, ki pukri wah bad ka kynrum kynram lum.',
    },
    'Heartwarming & Emotional': {
      name: 'Kaba Pynsngewbha ia ka Doonuk',
      shortName: 'Pynsngewbha',
      description: 'Ka thain jain ryndia kpa tymmen, ka sha step bad ki shithi maya.',
    },
    'Folk-Wisdom': {
      name: 'Ka Jingstad Tynrai',
      shortName: 'Jingstad Tynrai',
      description: 'Ki jingkieng thied dieng ba im, ka jingiabhah bad ki ktien tymmen.',
    },
  },
  grt: {
    'Historical Fiction / Folk-History': {
      name: 'Dakmesokani Itihas',
      shortName: 'Itihas Golpo',
      description: 'Chibimani dakgrikatanirang, nokmaming nok, aro pagitchamrangni bil.',
    },
    'Atmospheric Mystery / Thriller': {
      name: 'A·bao Jagokani / Mystery',
      shortName: 'Jagokani',
      description: 'Walni me·gumu, bangsi sikani, a·songni seng·ani aro a·bri seng·gimin.',
    },
    'Heartwarming & Emotional': {
      name: 'Ka·tong Nangani',
      shortName: 'Ka·tong Nangani',
      description: 'Nokdangni ba·ra dokani, pringni cha ringani aro ka·sani chittirang.',
    },
    'Folk-Wisdom': {
      name: 'A·chik Seng·ani',
      shortName: 'Seng·ani',
      description: 'Ja·dilni jalang, sual·e cha·ani aro pagitchamrangni u·iani.',
    },
  },
  trp: {
    'Historical Fiction / Folk-History': {
      name: 'Dophani Swrwngma / Hachuk Jarimin',
      shortName: 'Hachuk Jarimin',
      description: 'Twima ni daobah, ha-kotor, lung kotor aro kotorrokni sahas.',
    },
    'Atmospheric Mystery / Thriller': {
      name: 'Kutung / Kiting Khakchangma',
      shortName: 'Kiting Chanchirma',
      description: 'Hor ni kuha, sumui ni sur, twi baksa tongnai dwe aro hachukni bati.',
    },
    'Heartwarming & Emotional': {
      name: 'Bwkha Rwi Naisa',
      shortName: 'Bwkha Rwi',
      description: 'Nok ni risa thungna, phung ni cha garam aro chithi hamjakma.',
    },
    'Folk-Wisdom': {
      name: 'Hachukna Giyan',
      shortName: 'Hachuk Giyan',
      description: 'Thwngnai rotsang daula, rwi chana aro achu-chuchurok ni sonam.',
    },
  },
  nag: {
    'Historical Fiction / Folk-History': {
      name: 'Purana Kotha / Folk History',
      shortName: 'Purana Kotha',
      description: 'Nodi laga larai, raja ghor, bishi daang patthar aru purana manu laga himmat.',
    },
    'Atmospheric Mystery / Thriller': {
      name: 'Bhoot / Mystery Kotha',
      shortName: 'Mystery Kotha',
      description: 'Rati laga kuheli, banshi laga sur, nodi phumdi aru pahar laga bati.',
    },
    'Heartwarming & Emotional': {
      name: 'Bhal Laga / Dil Chhuwa Kotha',
      shortName: 'Dil Chhuwa',
      description: 'Ghor manu laga muga kapra buni, sokal laga gorom cha aru morom chithi.',
    },
    'Folk-Wisdom': {
      name: 'Gharu Shiksha / Folk Wisdom',
      shortName: 'Folk Wisdom',
      description: 'Jinda jora pul, baati kene khowa aru bura bura manu laga daang sikh.',
    },
  },
  ne: {
    'Historical Fiction / Folk-History': {
      name: 'ऐतिहासिक कथा र लोक-इतिहास',
      shortName: 'लोक-इतिहास',
      description: 'नदीका युद्धहरू, राजदरबार, ढुङ्गाका खम्बाहरू र पुर्खाहरूको साहसको कथा।',
    },
    'Atmospheric Mystery / Thriller': {
      name: 'रोमाञ्चक रहस्य र थ्रिलर',
      shortName: 'रोमाञ्चक रहस्य',
      description: 'मध्यरातको कुहिरो, बाँसुरीको धुन, तैरिने टापुहरू र पहाडी उज्यालो।',
    },
    'Heartwarming & Emotional': {
      name: 'मन छुने र भावनात्मक',
      shortName: 'मन छुने',
      description: 'पुस्तौंदेखि बुनिएको रेशमी कपडा, बिहानको तातो चिया र पुराना मायालु पत्रहरू।',
    },
    'Folk-Wisdom': {
      name: 'लोक-ज्ञान र बुद्धि',
      shortName: 'लोक-ज्ञान',
      description: 'जीवित जराका पुलहरू, मिलेर बाँड्ने संस्कार र बूढापाकाका अमूल्य उपदेश।',
    },
  },
  hi: {
    'Historical Fiction / Folk-History': {
      name: 'ऐतिहासिक कथा / लोक-इतिहास',
      shortName: 'लोक-इतिहास',
      description: 'नदी के युद्ध, राजमहल, पूज्य प्रस्तर स्तंभ और पूर्वजों के शौर्य की गाथाएँ।',
    },
    'Atmospheric Mystery / Thriller': {
      name: 'रहस्यमय और रोमांचक',
      shortName: 'रहस्य व रोमांच',
      description: 'आधी रात का कोहरा, बाँसुरी की गूँज, तैरते द्वीप और पहाड़ियों की रहस्यमयी रोशनी।',
    },
    'Heartwarming & Emotional': {
      name: 'दिल को छू लेने वाली',
      shortName: 'दिल को छूने वाली',
      description: 'पीढ़ियों से बुनते सिल्क के करघे, सुबह की गर्म चाय और संजोए हुए पुराने पत्र।',
    },
    'Folk-Wisdom': {
      name: 'लोक-ज्ञान और सीख',
      shortName: 'लोक-ज्ञान',
      description: 'जीवित जड़ों के पुल, बाँटकर खाने की सीख और बुजुर्गों की कालजयी प्रज्ञा।',
    },
  },
  en: {
    'Historical Fiction / Folk-History': {
      name: 'Historical Fiction / Folk-History',
      shortName: 'Historical / Folk-History',
      description: 'River battles, royal palaces, sacred stone monoliths, and ancestral courage.',
    },
    'Atmospheric Mystery / Thriller': {
      name: 'Atmospheric Mystery / Thriller',
      shortName: 'Atmospheric Mystery',
      description: 'Midnight fog, haunting flutes, wandering lake islands, and twilight mountain lights.',
    },
    'Heartwarming & Emotional': {
      name: 'Heartwarming & Emotional',
      shortName: 'Heartwarming',
      description: 'Generations mending family silk, warm dawn tea, and cherished nostalgic letters.',
    },
    'Folk-Wisdom': {
      name: 'Folk-Wisdom',
      shortName: 'Folk-Wisdom',
      description: 'Living root bridges, fables of sharing, and ancient lessons from wise elders.',
    },
  },
};

export const getLocalizedSection = (cat: StoryCategory, lang: LanguageCode): LocalizedSectionInfo => {
  return SECTION_TRANSLATIONS[lang]?.[cat] || SECTION_TRANSLATIONS.en[cat];
};

// Localized Story Titles & Synopses
interface LocalizedStoryMeta {
  title: string;
  synopsis: string;
  culturalLore: string;
}

const STORY_TRANSLATIONS: Record<string, Record<LanguageCode, LocalizedStoryMeta>> = {
  'story-burhi-aai': {
    as: {
      title: 'বুঢ়ী আইৰ ফুচফুচনি',
      synopsis: 'বৰ লুইতৰ পাৰত চাংঘৰৰ জোনাকী আৰু ককাক ভবধৰৰ সোণালী এড়ী-মুগাৰ তাঁতশাল আৰু শৰাইঘাটৰ বীৰত্বৰ স্মৃতি।',
      culturalLore: 'ব্ৰহ্মপুত্ৰৰ বুকুৰ পলসুৱা মাটি আৰু আহোম যুগৰ বীৰ লাচিত বৰফুকনৰ ৰণনীতিৰ সোঁৱৰণী।',
    },
    brx: {
      title: 'बुढि आइयानि खुसखुसायनाय',
      synopsis: 'बर’ लुइतनि सेर आव सांजुलि नखराव जुनाखि आरो आबौ भबधरनि खुन दानाय आरो सराइघाटनि बाथ्रा।',
      culturalLore: 'ब्रह्मपुत्र दैमानि सेर आव आहोम राजानि साहसि जारौमिन।',
    },
    mni: {
      title: 'বুঢ়ী আইগী ঈরেপ',
      synopsis: 'ব্রহ্মপুত্র তুরেল মপালগী য়ুমথক্তা জুনাখী অমসুং ইপু ভবধরগী য়োংখাম অমসুং চরাঈঘাট লানগী পুৱারী।',
      culturalLore: 'আহোম নিংথৌগী মতমগী লাচিত বরফুকনগী লানফমগী খোঞ্জেল।',
    },
    lus: {
      title: 'Pi Tar Phunnawi',
      synopsis: 'Brahmaputra luipui kama chang-ghar inah Junaki leh pu Bhabadhar-te la tah chanchin leh Saraighat indo huaisen.',
      culturalLore: 'Brahmaputra lui dung titi leh Ahom ram ropui laia do hnehna ropui.',
    },
    kha: {
      title: 'Ka Jingkhuslai ka Mei-Iaw',
      synopsis: 'Hapoh ka rud wah Brahmaputra, ha iing-thap i Junaki bad u kpa tymmen Bhabadhar ba thain ryndia ryngkat ka thma Saraighat.',
      culturalLore: 'Ka jingithuhpaw ka wah bah bad ka bor shlur jong u Lachit Borphukan.',
    },
    grt: {
      title: 'Ambini Ku·rang',
      synopsis: 'Brahmaputra chibima sepango Junaki aro Bhabadhar-ni ba·ra dokani aro Saraighat dakgrikatanini golpo.',
      culturalLore: 'Brahmaputra aro Ahom rajarangni bilakgipa itihas.',
    },
    trp: {
      title: 'Achu-Buma bai Kisa Kisa',
      synopsis: 'Brahmaputra twima rwngsalo Junaki tei achu Bhabadhar ni risa thungma tei Saraighat daobah ni jarimin.',
      culturalLore: 'Brahmaputra twima tei Ahom raja ni kotor sahas.',
    },
    nag: {
      title: 'Burhi Aai laga Fushfush',
      synopsis: 'Brahmaputra nodi par chang-ghar te Junaki aru dada Bhabadhar laga muga kapra buni aru Saraighat larai kotha.',
      culturalLore: 'Brahmaputra nodi aru Ahom raja laga bir sipahi Lachit Borphukan.',
    },
    ne: {
      title: 'बुढी आमाको कानाखुसी',
      synopsis: 'ब्रह्मपुत्रको किनारमा जुनाकी र उनका बाजे भवधरको रेशमी तान र शराइघाट युद्धको गौरवशाली सम्झना।',
      culturalLore: 'ब्रह्मपुत्र नदीको पवित्र बाछिटा र अहोम साम्राज्यको शौर्यपूर्ण इतिहास।',
    },
    hi: {
      title: 'बूढ़ी आई की फुसफुसाहट',
      synopsis: 'ब्रह्मपुत्र के तट पर जुनाकी और उसके दादा भवधर के करघे की खट-खट और सरायघाट के ऐतिहासिक शौर्य की गाथा।',
      culturalLore: 'ब्रह्मपुत्र नदी की लहरों में रची-बसी अहोम साम्राज्य और लचित बोरफुकन की वीरता।',
    },
    en: {
      title: 'Whispers of the Burhi Aai',
      synopsis: 'Along the misty banks of the Brahmaputra, a grandfather and granddaughter weave gold silk while royal memories stir.',
      culturalLore: 'The waters of Bor Luit carry the legacy of Saraighat and the steadfast defense of the Brahmaputra valley.',
    },
  },
  'story-krem-umbawa': {
    as: {
      title: 'ক্ৰেম উম্বাৱাৰ পলসুৱা মাটি',
      synopsis: 'মেঘালয়ৰ পূব খাছি পাহাৰত বা ডাপবিয়াং আৰু বাহ ক্সানৰ চকা লগোৱা বৰষুণৰ মাজত পুৰণি গুহাৰ ৰহস্যময় সন্ধান।',
      culturalLore: 'মাওফ্লাং পৱিত্ৰ অৰণ্য আৰু খাচী পাহাৰৰ প্ৰাচীন চূণশিলৰ গভীৰ গুহাৰ জীৱন-গাঁথা।',
    },
    brx: {
      title: 'क्रेम उम्बाबायानि हाब्रु',
      synopsis: 'मेघालय हाजोआव अखा हानायनि गेजेराव दापबियां आरो बाह सानमोननि गुफुर गुहा सोंनाय सल’।',
      culturalLore: 'मावफ्लां बाथौ हाग्रामा आरो खासि हाजोनि गोदोनां अन्थाइ गुहा।',
    },
    mni: {
      title: 'ক্রেম উম্বাওয়াগী লৈকাক',
      synopsis: 'মেঘালয়গী নোংচুবা চহীদা জাপ্পা নোংফমদা দাপবিয়াং অমসুং বাহ ক্সাননা খুগা অমগী সুরূং থিদোকপা।',
      culturalLore: 'মাওফ্লাং শেংলবা উমং অমসুং খাশি চীংগী অরিবা সুরূংগী শক্লোন।',
    },
    lus: {
      title: 'Krem Umbawa Lei Ngot',
      synopsis: 'East Khasi Hills ruahpui sur hnuaiah Dapbiang leh Bah Ksan-ten puk thuruk mak an zawng chhuak.',
      culturalLore: 'Mawphlang ram ngaw thianghlim leh Khasi tlang puk thuk tak chanchin.',
    },
    kha: {
      title: 'Ka Khyndew jong ka Krem Umbawa',
      synopsis: 'Ha ki lum East Khasi Hills hapoh ka slap bah, i Dapbiang bad u Bah Ksan ki wad ia ka jingtip tynrai shaphang ka krem.',
      culturalLore: 'Ka Lawkyntang Mawphlang bad ki krem mawshun ba rieh kiba don ha ki lum Khasi.',
    },
    grt: {
      title: 'Krem Umbawani A·a',
      synopsis: 'East Khasi Hills-o mikka jiminba Dapbiang aro Bah Ksan-ni a·a ning·o donggipa rong·kolko am·ani.',
      culturalLore: 'Mawphlang kosi buring aro Khasi a·brirangni rong·kol itihas.',
    },
    trp: {
      title: 'Krem Umbawa ni Hachuk',
      synopsis: 'East Khasi Hills hachuko watwi tulumo Dapbiang tei Bah Ksan ni lung bokhro ni thwngna khorang.',
      culturalLore: 'Mawphlang kotor ha-buring tei Khasi hachuk lung kotor ni kotha.',
    },
    nag: {
      title: 'Krem Umbawa laga Matti',
      synopsis: 'East Khasi Hills te bishi barish majote Dapbiang aru Bah Ksan purana gupha laga bhoot aru mystery khuji ase.',
      culturalLore: 'Mawphlang jungle aru Meghalaya pahar laga bishi purana pathor gupha.',
    },
    ne: {
      title: 'क्रेम उम्बावाको बालुवा र माटो',
      synopsis: 'मेघालयको पूर्वी खासी हिल्सको मुसलधारे वर्षामा दापबियाङ र बाह क्सानले प्राचीन गुफाको रहस्य खोतल्छन्।',
      culturalLore: 'मावफ्लाङको पवित्र वन र मेघालयका रहस्यमय चुनढुङ्गाका गुफाहरूको परम्परा।',
    },
    hi: {
      title: 'क्रेम उम्बावा की माटी',
      synopsis: 'मेघालय की पूर्वी खासी पहाड़ियों में मूसलाधार बारिश के बीच दापबियांग और बाह क्सान एक रहस्यमयी गुफा की खोज करते हैं।',
      culturalLore: 'मावफ्लांग का पवित्र उपवन और खासी पहाड़ियों की प्राचीन चूना-पत्थर की गुफाएँ।',
    },
    en: {
      title: 'The Silt of Krem Umbawa',
      synopsis: 'In the slate-grey downpours of the East Khasi Hills, a young ranger and an elder cave surveyor uncover living earth.',
      culturalLore: 'The sacred groves of Mawphlang and the ancient karst waterways beneath the plateau.',
    },
  },
  'story-interlocking-hearth': {
    as: {
      title: 'একত্ৰিত গৃহৰ জুহাল',
      synopsis: 'ৰেয়েকৰ সেউজীয়া পাহাৰত কা পু লালদিনাৰ বাঁহ-বেতৰ শিল্প আৰু দেওবৰীয়া প্ৰাৰ্থনাৰ সুৰত আত্মীয়তাৰ উম।',
      culturalLore: 'মিজোৰামৰ ত্লংগোৱাৰ সেউজীয়া উপত্যকা আৰু ৰেয়েক শৃংগৰ শান্ত প্ৰাকৃতিক পৰিৱেশ।',
    },
    brx: {
      title: 'दानसावनाय उन्दै अरखां',
      synopsis: 'रेयेक हाजोनि गोदुं साहा सानथाव का पु लालदिनायानि ओवा-गिदिं दिहुननाय आरो इसोरनि मेथाइ।',
      culturalLore: 'मिजोरामनि रेयेक हाजो आरो नखरा थामहिनबा दानसावनाय आरिमु।',
    },
    mni: {
      title: 'অমত্তা ওঈবা মৈথুং',
      synopsis: 'রেয়েক চীংগী ৱা অমসুং লিশিংগী শক্লোনদা কা পু লালদিনাগী খুৎহৈবা অমসুং ঈরাই-নুমিৎকী ঈশৈ।',
      culturalLore: 'মিজোরামগী রেয়েক পিক অমসুং লুচিংবা কা পু লালদিনাগী মৈথুংগী নুংশিবা।',
    },
    lus: {
      title: 'Inzawmkhawm Meipui',
      synopsis: 'Reiek tlang cham duai maiah Ka Pu Laldina hovin mau thir zung tah chanchin leh kohhran hla mawi.',
      culturalLore: 'Reiek tlang mawi leh Mizo tlawmngaihna thinlung thianghlim.',
    },
    kha: {
      title: 'Ka Rympei Ba Iateh',
      synopsis: 'Ha ki lum Reiek, u Ka Pu Laldina u thain ia u siej ha ryngkat ki jingrwai shnong ba sngewthiang.',
      culturalLore: 'Ki lum Reiek jong ka Mizoram bad ka mynsiem iarap lok kaba khraw.',
    },
    grt: {
      title: 'Nangrimgimin Wal·kual',
      synopsis: 'Reiek a·brio Ka Pu Laldina-ni wa·a seani aro torom gital ring·ani git sepango donggipa golpo.',
      culturalLore: 'Mizoram Reiek a·bri aro pagitchamrangni nokdang ka·sanani.',
    },
    trp: {
      title: 'Hormu ni Nok',
      synopsis: 'Reiek hachuk baha Ka Pu Laldina ni wa dung ma tei Isor ni rwchapmung hamjakma.',
      culturalLore: 'Mizoram Reiek hachuk tei dophani thungna sonam.',
    },
    nag: {
      title: 'Mili-juli laga Chulha',
      synopsis: 'Reiek pahar te Ka Pu Laldina banshi aru baah laga tokri banai thaka aru geet gaise morom pora.',
      culturalLore: 'Mizoram Reiek pahar aru Mizo manu laga ek-dusra ke sahai kora mon.',
    },
    ne: {
      title: 'जोडिएको अँगेठो',
      synopsis: 'रेयेकका हरियाली पहाडहरूमा का पु लालदिनाको बाँसको सिप र आइतबारको भजनले भर्ने आत्मियता।',
      culturalLore: 'मिजोरमको रेयेक डाँडा र पारिवारिक आत्मीयताको न्यानो परम्परा।',
    },
    hi: {
      title: 'एकता की अंगीठी',
      synopsis: 'रेयेक की हरी-भरी पहाड़ियों में का पु लालदिना की बाँस की बुनाई और गिरजाघर के भजनों की आत्मीय गूँज।',
      culturalLore: 'मिज़ोरम की रेयेक चोटी और मिज़ो समाज की मिल-जुलकर रहने की त्लावमंगाइहना भावना।',
    },
    en: {
      title: 'The Interlocking Hearth',
      synopsis: 'In the morning mist of Reiek, an elder cane craftsman pares rawal bamboo as village hymns drift across terraced slopes.',
      culturalLore: 'The bamboo forests of Reiek ridge and the ancient Mizo spirit of communal solidarity (Tlawmngaihna).',
    },
  },
  'story-beneath-the-phumdi': {
    as: {
      title: 'ফুমদিৰ তলত',
      synopsis: 'লোকটাক হ্ৰদৰ ওপঙা ফুমদিৰ ওপৰত এমা শান্তোম্বি আৰু নাতি য়াইখোম্বাৰ মাছ ধৰা আৰু পূৰ্বপুৰুষৰ সংৰক্ষণৰ সাধু।',
      culturalLore: 'কেইবুল লামজাও ৰাষ্ট্ৰীয় উদ্যান আৰু মেইটেই সংস্কৃতিৰ পৱিত্ৰ লোকটাক হ্ৰদৰ ফুমশ্বাং জীৱন।',
    },
    brx: {
      title: 'फुम्दिनि सिंआव',
      synopsis: 'लोकताक बिलोआव एमा सान्तोम्बि आरो इयुनाव खौसे जानाय ना हमनाय आरो लोकताकनि सल’।',
      culturalLore: 'केबुल लामजाव हाग्रामा आरो मैतै आरिमुनि लोकताक बिलोनि फुमदि।',
    },
    mni: {
      title: 'ফুমদি মখাদা',
      synopsis: 'লোকতাক পাৎকী ফুমদি মথক্তা এমা শান্তোম্বী অমসুং য়াঈখোম্বানা ঙা ফাবা অমসুং অরিবা পাউতাক।',
      culturalLore: 'কেইবুল লামজাও নেস্নেল পার্ক অমসুং মৈতৈ মীয়ামগী নুংশিরবা লোকতাক পাৎ।',
    },
    lus: {
      title: 'Phumdi Hnuai Lamah',
      synopsis: 'Loktak dil chung phumdi thliarkarah Ema Sanatombi leh Yaikhomba sangha man chanchin ropui.',
      culturalLore: 'Keibul Lamjao ram humhalh leh Meitei hnam ziarang mawi tak.',
    },
    kha: {
      title: 'Hapoh ka Phumdi',
      synopsis: 'Ha ka pung Loktak halor ki phumdi ba per, i Ema Sanatombi bad u Yaikhomba ki thwet dohkha bad ki khana.',
      culturalLore: 'Ka Keibul Lamjao National Park bad ka riti dustur Meitei.',
    },
    grt: {
      title: 'Phumdini Ning·o',
      synopsis: 'Loktak chibolo gitchonggipa phumdi kosako Ema Sanatombi aro Yaikhomba-ni na·tok rim·ani.',
      culturalLore: 'Keibul Lamjao National Park aro Meitei jatni Loktak chibol.',
    },
    trp: {
      title: 'Phumdi ni Talio',
      synopsis: 'Loktak dwe baha Ema Sanatombi tei Yaikhomba ni a ni thwngma tei achu ni kotha.',
      culturalLore: 'Keibul Lamjao National Park tei Meitei dophani Loktak dwe.',
    },
    nag: {
      title: 'Phumdi laga Tolot',
      synopsis: 'Loktak pukhuri laga utha dip phumdi te Ema Sanatombi aru chota bacha machi dhori thaka kotha.',
      culturalLore: 'Keibul Lamjao National Park aru Manipur Meitei manu laga Loktak pukhuri prem.',
    },
    ne: {
      title: 'फुमदीको मुनि',
      synopsis: 'लोकताक तालका तैरिने फुमदीहरूमाझ एमा सान्तोम्बी र उनका नातिको माछा मार्ने जीवनशैली र परम्परागत ज्ञान।',
      culturalLore: 'केइबुल लामजाओ राष्ट्रिय निकुञ्ज र मेइतेइ जातिको लोकताक तालप्रतिको अगाध श्रद्धा।',
    },
    hi: {
      title: 'फुमदी के नीचे',
      synopsis: 'लोकताक झील के तैरते हुए वृत्ताकार द्वीपों (फुमदी) पर एमा सानतोम्बी और पोते याइखोम्बा की मछली पकड़ने व झील रक्षा की कहानी।',
      culturalLore: 'केइबुल लामजाओ राष्ट्रीय उद्यान और मेइतेई परंपरा में पवित्र लोकताक झील का संरक्षण।',
    },
    en: {
      title: 'Beneath the Phumdi',
      synopsis: 'On the floating rings of Loktak Lake, a grandmother teaches her grandson the balance between human hunger and the water reed ecosystem.',
      culturalLore: 'The floating huts (phumshangs) and the sacred ecology of Keibul Lamjao, home of the Sangai deer.',
    },
  },
};

export const getLocalizedStoryMeta = (storyId: string, lang: LanguageCode): LocalizedStoryMeta | null => {
  return STORY_TRANSLATIONS[storyId]?.[lang] || STORY_TRANSLATIONS[storyId]?.en || null;
};

// Localized State Names
const STATE_NAMES: Record<string, Record<LanguageCode, string>> = {
  'All States': {
    as: 'সকলো ৰাজ্য',
    brx: 'गासै रायजो',
    mni: 'ষ্টেট পুম্নমক',
    lus: 'State Zawng',
    kha: 'Baroh Ki Jylla',
    grt: 'Gimik Staterang',
    trp: 'Bebak State',
    nag: 'Sob State',
    ne: 'सबै राज्यहरू',
    hi: 'सभी राज्य',
    en: 'All States',
  },
  Assam: {
    as: 'অসম',
    brx: 'आसाम',
    mni: 'অসাম',
    lus: 'Assam',
    kha: 'Assam',
    grt: 'Assam',
    trp: 'Assam',
    nag: 'Assam',
    ne: 'असम',
    hi: 'असम',
    en: 'Assam',
  },
  Meghalaya: {
    as: 'মেঘালয়',
    brx: 'मेघालाय',
    mni: 'মেঘালয়',
    lus: 'Meghalaya',
    kha: 'Meghalaya',
    grt: 'Meghalaya',
    trp: 'Meghalaya',
    nag: 'Meghalaya',
    ne: 'मेघालय',
    hi: 'मेघालय',
    en: 'Meghalaya',
  },
  Manipur: {
    as: 'মণিপুৰ',
    brx: 'मनिपुर',
    mni: 'মণিপুর',
    lus: 'Manipur',
    kha: 'Manipur',
    grt: 'Manipur',
    trp: 'Manipur',
    nag: 'Manipur',
    ne: 'मणिपुर',
    hi: 'मणिपुर',
    en: 'Manipur',
  },
  Mizoram: {
    as: 'মিজোৰাম',
    brx: 'मिजोराम',
    mni: 'মিজোরাম',
    lus: 'Mizoram',
    kha: 'Mizoram',
    grt: 'Mizoram',
    trp: 'Mizoram',
    nag: 'Mizoram',
    ne: 'मिजोरम',
    hi: 'मिज़ोरम',
    en: 'Mizoram',
  },
  Nagaland: {
    as: 'নাগালেণ্ড',
    brx: 'नागालेण्ड',
    mni: 'নাগালেন্দ',
    lus: 'Nagaland',
    kha: 'Nagaland',
    grt: 'Nagaland',
    trp: 'Nagaland',
    nag: 'Nagaland',
    ne: 'नागाल्याण्ड',
    hi: 'नागालैंड',
    en: 'Nagaland',
  },
  Tripura: {
    as: 'ত্ৰিপুৰা',
    brx: 'त्रिपुरा',
    mni: 'ত্রিপুরা',
    lus: 'Tripura',
    kha: 'Tripura',
    grt: 'Tripura',
    trp: 'Twipra',
    nag: 'Tripura',
    ne: 'त्रिपुरा',
    hi: 'त्रिपुरा',
    en: 'Tripura',
  },
  Sikkim: {
    as: 'ছিকিম',
    brx: 'सिक्किम',
    mni: 'সিক্কিম',
    lus: 'Sikkim',
    kha: 'Sikkim',
    grt: 'Sikkim',
    trp: 'Sikkim',
    nag: 'Sikkim',
    ne: 'सिक्किम',
    hi: 'सिक्किम',
    en: 'Sikkim',
  },
};

export const getLocalizedState = (stateName: string, lang: LanguageCode): string => {
  return STATE_NAMES[stateName]?.[lang] || stateName;
};

// Localized Districts / Areas
const DISTRICT_NAMES: Record<string, Partial<Record<LanguageCode, string>>> = {
  'All Areas': {
    as: 'সকলো অঞ্চল',
    brx: 'गासै ओनसोल',
    mni: 'মফম পুম্নমক',
    lus: 'Hmun Zawng',
    kha: 'Baroh Ki Thain',
    grt: 'Gimik A·damrang',
    trp: 'Bebak Jayga',
    nag: 'Sob Area',
    ne: 'सबै क्षेत्रहरू',
    hi: 'सभी क्षेत्र',
    en: 'All Areas',
  },
  Kamrup: { as: 'কামৰূপ', hi: 'कामरूप', ne: 'कामरूप', en: 'Kamrup' },
  Majuli: { as: 'মাজুলী', hi: 'माजुली', ne: 'माजुली', en: 'Majuli' },
  Haflong: { as: 'হাফলং', hi: 'हाफलोंग', ne: 'हाफलोङ', en: 'Haflong' },
  Sualkuchi: { as: 'শুৱালকুছি', hi: 'सुआलकुची', ne: 'सुवालकुची', en: 'Sualkuchi' },
  'East Khasi Hills': { as: 'পূব খাছি পাহাৰ', kha: 'East Khasi Hills', hi: 'पूर्वी खासी हिल्स', en: 'East Khasi Hills' },
  Sohra: { as: 'চোহৰা', kha: 'Sohra', hi: 'सोहरा', en: 'Sohra' },
  Cherrapunji: { as: 'চেৰাপুঞ্জী', kha: 'Cherrapunji', hi: 'चेरापूंजी', en: 'Cherrapunji' },
  Shillong: { as: 'শ্বিলং', kha: 'Shillong', hi: 'शिलांग', en: 'Shillong' },
  Loktak: { as: 'লোকটাক', mni: 'লোকতাক', hi: 'लोकताक', en: 'Loktak' },
  Bishnupur: { as: 'বিষ্ণুপুৰ', mni: 'বিষ্ণুপুর', hi: 'विष्णुपुर', en: 'Bishnupur' },
  Moirang: { as: 'মইৰাং', mni: 'মোইরাং', hi: 'मोइरांग', en: 'Moirang' },
  Imphal: { as: 'ইম্ফল', mni: 'ইম্ফাল', hi: 'इम्फाल', en: 'Imphal' },
  Reiek: { as: 'ৰেয়েক', lus: 'Reiek', hi: 'रेयेक', en: 'Reiek' },
  Aizawl: { as: 'আইজল', lus: 'Aizawl', hi: 'आइजोल', en: 'Aizawl' },
  Champhai: { as: 'চাম্ফাই', lus: 'Champhai', hi: 'चम्फाई', en: 'Champhai' },
  Kohima: { as: 'কহিমা', nag: 'Kohima', hi: 'कोहिमा', en: 'Kohima' },
  Agartala: { as: 'আগৰতলা', trp: 'Agartala', hi: 'अगरतला', en: 'Agartala' },
  Gangtok: { as: 'গেংটক', ne: 'गान्तोक', hi: 'गंगटोक', en: 'Gangtok' },
  'South Sikkim': { as: 'দক্ষিণ ছিকিম', ne: 'दक्षिण सिक्किम', hi: 'दक्षिण सिक्किम', en: 'South Sikkim' },
};

export const getLocalizedDistrict = (district: string, lang: LanguageCode): string => {
  return DISTRICT_NAMES[district]?.[lang] || DISTRICT_NAMES[district]?.en || district;
};

// Story Tab UI strings
export const getStoryUiStrings = (lang: LanguageCode) => {
  const dict: Record<LanguageCode, {
    allSections: string;
    filterByState: string;
    filterByArea: string;
    awaitingTitle: string;
    awaitingDesc: string;
    readingView: string;
    storyNarrative: string;
    regionalContext: string;
    audioStoryteller: string;
    authenticNarration: string;
    listenAndRead: string;
    listenStory: string;
    bhashiniVoice: string;
    naturalTone: string;
    stateLabel: string;
    areaLabel: string;
    categoryLabel: string;
  }> = {
    as: {
      allSections: 'সকলো শাখা',
      filterByState: 'ৰাজ্য বাছক',
      filterByArea: 'অঞ্চল বাছক',
      awaitingTitle: 'এই শাখাত আপোনাৰ গল্পৰ বাবে অপেক্ষাৰত',
      awaitingDesc: 'ইয়াত প্ৰকাশ কৰা গল্পসমূহ কণ্ঠস্বৰ আৰু পাঠ-নিয়ন্ত্ৰণৰ সৈতে দৃশ্যমান হ’ব।',
      readingView: 'পঠন দৰ্শন',
      storyNarrative: 'কাহিনীৰ মূল কথা',
      regionalContext: 'আঞ্চলিক পটভূমি আৰু লোক-ঐতিহ্য',
      audioStoryteller: 'কণ্ঠৰে সাধুকথা কোৱা',
      authenticNarration: 'প্ৰাকৃতিক আঞ্চলিক কণ্ঠস্বৰ',
      listenAndRead: 'শুনক আৰু একেলগে পঢ়ক',
      listenStory: 'সাধু শুনক',
      bhashiniVoice: 'ভাষিনী আঞ্চলিক কণ্ঠ',
      naturalTone: 'প্ৰাকৃতিক কথন শৈলী আৰু শান্ত পৰিৱেশ',
      stateLabel: 'ৰাজ্য',
      areaLabel: 'অঞ্চল',
      categoryLabel: 'শাখা',
    },
    brx: {
      allSections: 'गासै बिभाग',
      filterByState: 'रायजो सायख’',
      filterByArea: 'ओनसोल सायख’',
      awaitingTitle: 'बे बिभागाव नोंथांनि सल’नि थाखाय नेना दं',
      awaitingDesc: 'बेयाव फोसावनाय सल’फोरा खोनासंनो आरो फरायनो मोनगोन।',
      readingView: 'फरायनाय नुथाय',
      storyNarrative: 'सल’नि गाहाय खोथा',
      regionalContext: 'ओनसोलारि आरिमु आरो गोदोनां सल’',
      audioStoryteller: 'खोनासंनो सल’',
      authenticNarration: 'गाहाम ओनसोलारि राव',
      listenAndRead: 'खोनासं आरो फराय',
      listenStory: 'सल’ खोनासं',
      bhashiniVoice: 'भाषिनी राव',
      naturalTone: 'सिरि आरो मोजां खोनासंनो',
      stateLabel: 'रायजो',
      areaLabel: 'ओनसोल',
      categoryLabel: 'बिभाग',
    },
    mni: {
      allSections: 'পুম্নমক',
      filterByState: 'ষ্টেট খল্লু',
      filterByArea: 'মফম খল্লু',
      awaitingTitle: 'মসিগী শরুক্তা অদোমগী ৱারীগীদমক ঙাইরি',
      awaitingDesc: 'মফমসিদা ফোংলিবা ৱারীশিং খোঞ্জেল অমসুং পারগা তারসি।',
      readingView: 'পাবগী শক্লোন',
      storyNarrative: 'ৱারীগী মরূওইবা',
      regionalContext: 'মফমগী পুৱারী অমসুং ইনাকখুল্লবা লৈরিবশিং',
      audioStoryteller: 'ৱারী তারসি',
      authenticNarration: 'লৈবাক্কী অশেংবা খোঞ্জেল',
      listenAndRead: 'তারগা পারসি',
      listenStory: 'ৱারী তাউ',
      bhashiniVoice: 'ভাষিনী খোঞ্জেল',
      naturalTone: 'শান্ত অমসুং অশেংবা খোঞ্জেল',
      stateLabel: 'ষ্টেট',
      areaLabel: 'মফম',
      categoryLabel: 'শরুক',
    },
    lus: {
      allSections: 'A Zavai',
      filterByState: 'State Thlang Rawh',
      filterByArea: 'Hmun Thlang Rawh',
      awaitingTitle: 'He hmunah hian i thawnthu nghah a ni',
      awaitingDesc: 'Thawnthu dah tharte chu aw ngaihthlakna leh chhiar rualna nen a lo lang ang.',
      readingView: 'Chhiar Dan',
      storyNarrative: 'Thawnthu Tak',
      regionalContext: 'Hmun Chanchin leh Ziarang',
      audioStoryteller: 'Thawnthu Sawi Tu',
      authenticNarration: 'Tualchhung aw ngei',
      listenAndRead: 'Ngaihla & Chhiar Rual Rawh',
      listenStory: 'Thawnthu Ngaithla Rawh',
      bhashiniVoice: 'Bhashini Aw',
      naturalTone: 'Mawi leh dam takin',
      stateLabel: 'State',
      areaLabel: 'Hmun',
      categoryLabel: 'Chanchin',
    },
    kha: {
      allSections: 'Baroh Ki Bynta',
      filterByState: 'Jied ia ka Jylla',
      filterByArea: 'Jied ia ka Thain',
      awaitingTitle: 'Dang ap ia ki khana jong phi hangne',
      awaitingDesc: 'Ki khana ba pynmih hangne kin don ryngkat ka sur kren bad ka pule lang.',
      readingView: 'Ka Rukom Pule',
      storyNarrative: 'Ka Khana Tynrai',
      regionalContext: 'Ka Jinglong Tynrai ka Shnong',
      audioStoryteller: 'U Nongiathuhkhana',
      authenticNarration: 'Ka sur kren kaba shisha',
      listenAndRead: 'Sngap & Pule Lang',
      listenStory: 'Sngap ia ka Khana',
      bhashiniVoice: 'Ka Sur Bhashini',
      naturalTone: 'Kaba jai jai bad shai',
      stateLabel: 'Jylla',
      areaLabel: 'Thain',
      categoryLabel: 'Bynta',
    },
    grt: {
      allSections: 'Gimik Bakrang',
      filterByState: 'Stateko Seokbo',
      filterByArea: 'A·damko Seokbo',
      awaitingTitle: 'Ia bako nang·ni golpona senga',
      awaitingDesc: 'Ia biapo dingtangmancha ku·rangchi knana aro poraina man·gen.',
      readingView: 'Poraini Riko',
      storyNarrative: 'Golponi A·sel',
      regionalContext: 'Jatni Katta aro Itihas',
      audioStoryteller: 'Golpo Agangipa',
      authenticNarration: 'Be·wal ku·rang',
      listenAndRead: 'Knabo & Porairimbo',
      listenStory: 'Golpoko Knabo',
      bhashiniVoice: 'Bhashini Ku·rang',
      naturalTone: 'Tomal aro rong·tal',
      stateLabel: 'State',
      areaLabel: 'A·dam',
      categoryLabel: 'Bak',
    },
    trp: {
      allSections: 'Bebak Bag',
      filterByState: 'State Saikha',
      filterByArea: 'Jayga Saikha',
      awaitingTitle: 'O bago nini kothani bagwi khna twng',
      awaitingDesc: 'Orono phonokmani kotharok khnamung tei poraimung bai phaikha.',
      readingView: 'Poraini Nukmung',
      storyNarrative: 'Kothani Kwrwi',
      regionalContext: 'Dophani Hachuk Jarimin',
      audioStoryteller: 'Kotha Sanai',
      authenticNarration: 'Achu ni khorang',
      listenAndRead: 'Khna Tei Porai',
      listenStory: 'Kotha Khna',
      bhashiniVoice: 'Bhashini Khorang',
      naturalTone: 'Kahalo khnamung',
      stateLabel: 'State',
      areaLabel: 'Jayga',
      categoryLabel: 'Bag',
    },
    nag: {
      allSections: 'Sob Section',
      filterByState: 'State Chunibi',
      filterByArea: 'Area Chunibi',
      awaitingTitle: 'Etu jagah te apuni laga kotha karone rukhi ase',
      awaitingDesc: 'Ete publish kora kotha sob awaz aru pora control logot ulai jabo.',
      readingView: 'Pora View',
      storyNarrative: 'Asli Kotha',
      regionalContext: 'Jaga laga Purana Kotha',
      audioStoryteller: 'Kotha Suna Manu',
      authenticNarration: 'Local awaz te',
      listenAndRead: 'Sunibi aru Poribi',
      listenStory: 'Kotha Sunibi',
      bhashiniVoice: 'Bhashini Awaz',
      naturalTone: 'Aramse aru saaf awaz',
      stateLabel: 'State',
      areaLabel: 'Area',
      categoryLabel: 'Section',
    },
    ne: {
      allSections: 'सबै भागहरू',
      filterByState: 'राज्य छान्नुहोस्',
      filterByArea: 'क्षेत्र छान्नुहोस्',
      awaitingTitle: 'यस भागमा तपाईँका कथाहरूको प्रतीक्षा छ',
      awaitingDesc: 'यहाँ प्रकाशित कथाहरू स्वर वाचन र पढ्ने नियन्त्रणका साथ उपलब्ध हुनेछन्।',
      readingView: 'पढ्ने दृश्य',
      storyNarrative: 'कथाको मूल वृत्तान्त',
      regionalContext: 'क्षेत्रीय सन्दर्भ र लोक-संस्कृति',
      audioStoryteller: 'अडियो कथाकार',
      authenticNarration: 'मौलिक क्षेत्रीय स्वर',
      listenAndRead: 'सुन्नुहोस् र सँगै पढ्नुहोस्',
      listenStory: 'कथा सुन्नुहोस्',
      bhashiniVoice: 'भाषिणी क्षेत्रीय आवाज',
      naturalTone: 'प्राकृतिक र शान्त कथा वाचन',
      stateLabel: 'राज्य',
      areaLabel: 'क्षेत्र',
      categoryLabel: 'भाग',
    },
    hi: {
      allSections: 'सभी भाग',
      filterByState: 'राज्य चुनें',
      filterByArea: 'क्षेत्र चुनें',
      awaitingTitle: 'इस भाग में आपकी कहानियों की प्रतीक्षा है',
      awaitingDesc: 'यहाँ प्रकाशित कहानियाँ आवाज़ और पढ़ने के नियंत्रणों के साथ दिखाई देंगी।',
      readingView: 'पढ़ने का दृश्य',
      storyNarrative: 'कथा का मूल वृत्तांत',
      regionalContext: 'क्षेत्रीय संदर्भ व सांस्कृतिक धरोहर',
      audioStoryteller: 'ऑडियो कहानीकार',
      authenticNarration: 'प्रामाणिक क्षेत्रीय आवाज़',
      listenAndRead: 'सुनें और साथ-साथ पढ़ें',
      listenStory: 'कहानी सुनें',
      bhashiniVoice: 'भाषिणी क्षेत्रीय आवाज़',
      naturalTone: 'सहज व मधुर कथन शैली',
      stateLabel: 'राज्य',
      areaLabel: 'क्षेत्र',
      categoryLabel: 'श्रेणी',
    },
    en: {
      allSections: 'All Sections',
      filterByState: 'Filter by State',
      filterByArea: 'Filter by Area',
      awaitingTitle: 'Awaiting your stories in this section',
      awaitingDesc: 'Stories published here will appear with voice narration & read-along controls.',
      readingView: 'Reading View',
      storyNarrative: 'Story Narrative',
      regionalContext: 'Regional Context & Heritage',
      audioStoryteller: 'Audio Storyteller',
      authenticNarration: 'Authentic voice narration',
      listenAndRead: 'Listen & Read Along',
      listenStory: 'Listen to Story',
      bhashiniVoice: 'Bhashini Regional Voice',
      naturalTone: 'Natural storytelling tone with ambient balance',
      stateLabel: 'State',
      areaLabel: 'Area',
      categoryLabel: 'Category',
    },
  };

  return dict[lang] || dict.en;
};

// ============================================================================
// 2. TODAY SCREEN & REMINDERS LOCALIZATION
// ============================================================================

export interface LocalizedReminderText {
  title: string;
  subtitle: string;
}

const DEFAULT_REMINDERS_MAP: Record<string, Record<LanguageCode, LocalizedReminderText>> = {
  'rem-1': {
    as: { title: 'পুৱাৰ ঔষধৰ সময়', subtitle: 'পানীৰ সৈতে পুৱা ৯:৩০ বজাত খাব' },
    brx: { title: 'फुंनि मुलि लोंनाय', subtitle: 'दैजों फुंनि ९:३० आव लों' },
    mni: { title: 'অয়ুক্কী হিদাক চাবা', subtitle: 'ঈশিং লোয়ননা অয়ুক পুং ৯:৩০ দা চাবিয়ু' },
    lus: { title: 'Zing damdawi ei hun', subtitle: 'Tui nen zing dar 9:30 ah ei rawh' },
    kha: { title: 'Ka por dih dawai step', subtitle: 'Bad ka um step 9:30' },
    grt: { title: 'Pringni sam ringani', subtitle: 'Chi baksa pring 9:30 baji-o ringbo' },
    trp: { title: 'Phungni bwsari chana', subtitle: 'Tui bai phung 9:30 baji-o chadi' },
    nag: { title: 'Sokal laga medicine', subtitle: 'Pani logot 9:30 baje khabi' },
    ne: { title: 'बिहानको औषधि', subtitle: 'पानीसँग बिहान ९:३० बजे लिनुहोस्' },
    hi: { title: 'सुबह की दवाई का समय', subtitle: 'पानी के साथ सुबह 9:30 बजे लें' },
    en: { title: 'Medicine reminder', subtitle: 'BP tablet · 9:30 AM' },
  },
  'rem-2': {
    as: { title: 'উমাল পানী খোৱা', subtitle: 'এগিলাচ উমাল নেমু পানী · পুৱা ১১:৩০' },
    brx: { title: 'गोदुं दै लोंनाय', subtitle: 'मोनसे ग्लास गोदुं लेबु दै · फुंनि ११:३०' },
    mni: { title: 'অশাংবা ঈশিং থকপা', subtitle: 'চম্প্রা ঈশিং গ্লাস অমা · অয়ুক পুং ১১:৩০' },
    lus: { title: 'Tui lum in hun', subtitle: 'Nimbu tui lum no khat · zing dar 11:30' },
    kha: { title: 'Dih um syaid', subtitle: 'Kawei ka khuri um sohmynken syaid · step 11:30' },
    grt: { title: 'Ding·gipa chi ringani', subtitle: 'Lemu chi ding·gipa · pring 11:30' },
    trp: { title: 'Kwtwng tui nungna', subtitle: 'Lemu tui kwtwng kotor · phung 11:30' },
    nag: { title: 'Gorom pani khowa', subtitle: 'Nimbu logot gorom pani · 11:30 baje' },
    ne: { title: 'तातो पानी पिउने', subtitle: 'कागती मिसाएको एक गिलास तातो पानी · ११:३० बजे' },
    hi: { title: 'गुनगुना पानी पीना', subtitle: 'नींबू मिला एक गिलास गुनगुना पानी · सुबह 11:30' },
    en: { title: 'Warm hydration', subtitle: 'Glass of warm lemon water · 11:30 AM' },
  },
  'rem-3': {
    as: { title: 'গধূলিৰ খোজকঢ়া', subtitle: 'ফুলনিত শান্তভাৱে খোজ কঢ়া · আবেলি ৫:০০' },
    brx: { title: 'बेलासेथि थाबायनाय', subtitle: 'बारियाव सिरियै थाबायनाय · बेलासे ५:००' },
    mni: { title: 'নুমিদাংগী খোঙচৎ', subtitle: 'লৈবাক্কী লৈকোলদা চৎপা · নুমিদাং পুং ৫:০০' },
    lus: { title: 'Tlaiah kal chhuah', subtitle: 'Huanah muangchanga tei harh · tlai dar 5:00' },
    kha: { title: 'Iaiaid step kynmaw', subtitle: 'Iaiaid ha kper · janmiet 5:00' },
    grt: { title: 'Me·chik ba·ra re·ani', subtitle: 'Buringo re·ani · pring/attam 5:00' },
    trp: { title: 'Bisi rengna', subtitle: 'Bagan baha rengna · sanja 5:00' },
    nag: { title: 'Bikali ghumibole jowa', subtitle: 'Bagan te aaram pora ghumibi · 5:00 baje' },
    ne: { title: 'साँझको हिँडडुल', subtitle: 'बगैँचामा शान्त हिँडाइ · साँझ ५:०० बजे' },
    hi: { title: 'शाम की सैर', subtitle: 'बगीचे में हल्की सैर · शाम 5:00 बजे' },
    en: { title: 'Evening walk', subtitle: 'Gentle garden stroll with Sunita · 5:00 PM' },
  },
  'rem-4': {
    as: { title: 'ৰাতিৰ চকুৰ ঔষধ', subtitle: 'ৰাতিৰ আহাৰৰ পিছত চকুৰ ড্ৰপ · ৰাতি ৮:৪৫' },
    brx: { title: 'हरनि मेगननि मुलि', subtitle: 'हरनि जाखानायनि उनाव मेगननि मुलि · हरनि ८:४५' },
    mni: { title: 'অহিংগী মিতকী হিদাক', subtitle: 'চাক চাবা লোইবা মতুংদা মিত্তা থাবা · অহিং পুং ৮:৪৫' },
    lus: { title: 'Zan mit damdawi', subtitle: 'Zanriah ei hnuah mit damdawi thlawr · zan dar 8:45' },
    kha: { title: 'Dawai khmat miet', subtitle: 'Hadien ba la bam ja miet · miet 8:45' },
    grt: { title: 'Walni mikron sam', subtitle: 'Me·chik cha·a ja·mano · wal 8:45' },
    trp: { title: 'Hor ni mokol bwsari', subtitle: 'Hor ni chana pai khe · hor 8:45' },
    nag: { title: 'Rati laga chokhu medicine', subtitle: 'Khana khowa piche te chokhu te dhabi · 8:45 baje' },
    ne: { title: 'रातिको आँखाको औषधि', subtitle: 'खाना खाएपछि आँखामा ड्रप हाल्ने · रातको ८:४५' },
    hi: { title: 'रात की आँख की दवाई', subtitle: 'रात के भोजन के बाद आँखों में दवा डालें · रात 8:45' },
    en: { title: 'Night eye drops', subtitle: 'Lubricant drops after dinner · 8:45 PM' },
  },
};

export const getLocalizedReminder = (rem: Reminder, lang: LanguageCode): { title: string; subtitle: string } => {
  // If user custom reminder or voice reminder
  if (rem.isVoiceReminder || rem.category === 'voice') {
    const voiceTitles: Record<LanguageCode, string> = {
      as: 'কণ্ঠৰে স্মাৰক',
      brx: 'रावजों गोसोखां होनाय',
      mni: 'খোঞ্জেলগী স্মারক',
      lus: 'Aw hmanga hriattirna',
      kha: 'Ka jingkynmaw da ka sur',
      grt: 'Ku·rangchi gual·atani',
      trp: 'Khorang bai kok',
      nag: 'Voice Reminder',
      ne: 'स्वर रिमाइन्डर',
      hi: 'वॉइस रिमाइंडर',
      en: 'Voice Reminder',
    };
    return {
      title: voiceTitles[lang] || 'Voice Reminder',
      subtitle: rem.subtitle.replace('Voice Reminder', voiceTitles[lang] || 'Voice Reminder'),
    };
  }

  const found = DEFAULT_REMINDERS_MAP[rem.id]?.[lang];
  if (found) {
    return found;
  }

  return { title: rem.title, subtitle: rem.subtitle };
};

// Localized Family Members
interface LocalizedFamilyMemberText {
  relationship: string;
  voiceNoteText: string;
  hint: string;
}

const FAMILY_TRANSLATIONS: Record<string, Record<LanguageCode, LocalizedFamilyMemberText>> = {
  'fam-1': {
    as: {
      relationship: 'বৰ-বোৱাৰী',
      voiceNoteText: 'আইতা, পুৱাৰ খোজ কঢ়াৰ পিছত মই আদাৰ চাহ লৈ আহিম! সময়ত পানী খাব।',
      hint: 'তেখেতে প্ৰতি পুৱা হালধীয়া চাদৰ পিন্ধি উমাল আদা চাহ লৈ আহে।',
    },
    brx: {
      relationship: 'बराय बिहामजो',
      voiceNoteText: 'आइता, फुंनि थाबायनायनि उनाव आं हाद्रि साहा लाबोगोन! समाव दै लों।',
      hint: 'बिया फुंफ्रोमबो हलोदि गाननानै गोदुं साहा लाबोयो।',
    },
    mni: {
      relationship: 'অহানবা ইমা-মৌ',
      voiceNoteText: 'ইবেম্মা, অয়ুক খোঙচৎ চৎলকপা মতুংদা ঐ শিং চী পুদুনা লাক্কনি! মতম চানা ঈশিং থক্কদবনি।',
      hint: 'মহাক্না নুমিৎ খুদিংগী ঙাঙ্বা ফিজেৎ শেৎতুনা শিং চী পুরকই।',
    },
    lus: {
      relationship: 'Monu Upa Ber',
      voiceNoteText: 'Ka Pi, zing i teihawi zawhah thingpui hang ka rawn pe dawn che nia! Tui in theihnghilh suh aw.',
      hint: 'Zing tin kawr eng ha chunga thingpui sa rawn petu che a nih kha.',
    },
    kha: {
      relationship: 'Ka Kmie Kynsi',
      voiceNoteText: 'I Mei, hadien ba la wai ka jingiaiaid step, ngan wanrah sha syaid! Dih um bha ha ka por.',
      hint: 'Ka wanrah sha syaid man ka step bad ka phong ka jainstem.',
    },
    grt: {
      relationship: 'Nokgipa Namgipa',
      voiceNoteText: 'Ambik, pringo re·baon anga ding·gipa cha ra·bagen! Nambatgipa somoio chi ringbo.',
      hint: 'Pringanti rimit ganding gande ding·gipa cha ra·bagipa.',
    },
    trp: {
      relationship: 'Buma Kotor',
      voiceNoteText: 'Achu, phung bisi reng pai khe ang cha garam twlangano! Somoi bai tui nungdi.',
      hint: 'Bini bisingo phung brum brum cha garam twlangnai.',
    },
    nag: {
      relationship: 'Bor-Bhow (Daang Bou)',
      voiceNoteText: 'Aita, sokal te ghumike aaha pichete moi aada chaa aanibo! Pani thik time te khabi.',
      hint: 'Tai protidin haldi sador pindhikena aada chaa aani diye.',
    },
    ne: {
      relationship: 'जेठी बुहारी',
      voiceNoteText: 'हजुरआमा, बिहानको हिँडाइपछि म अदुवा चिया लिएर आउँछु है! समयमै पानी पिउनुहोला।',
      hint: 'उहाँ हरेक बिहान पहेँलो सारी लगाएर तातो अदुवा चिया ल्याइदिनुहुन्छ।',
    },
    hi: {
      relationship: 'बड़ी बहू',
      voiceNoteText: 'दादी जी, सुबह की सैर के बाद मैं अदरक वाली गरम चाय लाऊँगी! समय पर पानी पीते रहिएगा।',
      hint: 'वह हर सुबह पीली साड़ी पहनकर आपके लिए गरम अदरक की चाय लेकर आती हैं।',
    },
    en: {
      relationship: 'Bor-Bhow (Eldest Daughter-in-law)',
      voiceNoteText: 'Aita, I will bring warm ginger tea after your morning walk! Drink your water on time.',
      hint: 'She brings you warm ginger tea every morning and wears yellow sarees.',
    },
  },
  'fam-2': {
    as: {
      relationship: 'নাতি',
      voiceNoteText: 'আইতা! গুৱাহাটীৰ কলেজৰ প্ৰতিযোগিতাত আজি প্ৰথম হ’লোঁ! গধূলি ফোন কৰিম।',
      hint: 'আপোনাৰ নাতি যিয়ে চশমা পিন্ধে আৰু গুৱাহাটীত স্থাপত্যবিদ্যা পঢ়ি আছে।',
    },
    brx: {
      relationship: 'नाइथौ नाथि',
      voiceNoteText: 'आइता! गुवाहाटी कलेजआव आं दिनै देरहाबाय! बेलासे आं फोन खालामगोन।',
      hint: 'नोंथांनि नाथि जाय ससमा गानो आरो गुवाहाटीआव सोलोंगासिनो दं।',
    },
    mni: {
      relationship: 'ইশু নুপা',
      voiceNoteText: 'ইবেম্মা! গুৱাহাটিগী কোলেজগী চাংদম্নবদা ঙসি অহানবা তাখ্রে! নুমিদাংদা ফোন তৌরকপগে।',
      hint: 'অদোমগী ইশু নুপা চশমা উপ্পা অমসুং গুৱাহাটিদা লাইরিক তম্বা।',
    },
    lus: {
      relationship: 'Tu (Tupa)',
      voiceNoteText: 'Ka Pi! Vawiinah Guwahati college design inelnaah pakhatna ka ni e! Tlaiah ka rawn bia ang che.',
      hint: 'I tupa tarmit vuah, Guwahati-a architecture zir lai mek kha.',
    },
    kha: {
      relationship: 'U Ksuit (Ksu)',
      voiceNoteText: 'I Mei! Nga la jop ha ka jingiakop ha Guwahati college mynta! Ngan phone janmiet.',
      hint: 'U ksuit jong phi uba deng it-khmat bad pule ha Guwahati.',
    },
    grt: {
      relationship: 'Su·gipa',
      voiceNoteText: 'Ambik! Guwahati college-o anga cheaha! Attamo phone ka·gen.',
      hint: 'Nang·ni su·gipa it-khmat ganani aro Guwahati-o leka poragipa.',
    },
    trp: {
      relationship: 'Achu Sa',
      voiceNoteText: 'Achu! Guwahati college o tini ang first wangkha! Sanja khe phone khlaina.',
      hint: 'Nini achusa chosma ganai tei Guwahati o porinai.',
    },
    nag: {
      relationship: 'Nati (Pota)',
      voiceNoteText: 'Aita! Guwahati college te design competition te first prize paishey! Hominga phone koribo.',
      hint: 'Apuni laga pota juntu chasma pindhey aru Guwahati te porhi ase.',
    },
    ne: {
      relationship: 'नाति',
      voiceNoteText: 'हजुरआमा! गुवाहाटीको कलेज प्रतियोगितामा आज मैले पहिलो स्थान हासिल गरेँ! साँझ फोन गर्छु है।',
      hint: 'तपाईँको चस्मा लगाउने नाति, जो गुवाहाटीमा इन्जिनियरिङ पढ्दैछ।',
    },
    hi: {
      relationship: 'पोता',
      voiceNoteText: 'दादी जी! गुवाहाटी में कॉलेज की प्रतियोगिता में आज मैं प्रथम आया हूँ! शाम को फोन करूँगा।',
      hint: 'आपका पोता जो चश्मा पहनता है और गुवाहाटी में पढ़ाई कर रहा है।',
    },
    en: {
      relationship: 'Nati (Grandson)',
      voiceNoteText: 'Aita! I won the college design competition in Guwahati today! Calling you this evening.',
      hint: 'Your grandson who wears glasses and is studying architecture in Guwahati.',
    },
  },
  'fam-3': {
    as: {
      relationship: 'সৰু পুত্ৰ',
      voiceNoteText: 'মা, পুনেৰ পৰা আপোনালৈ মৰম যাচিলোঁ। আপুনি পঠোৱা আমৰ আচাৰ বৰ সুস্বাদু হৈছে।',
      hint: 'আপোনাৰ সৰু পুত্ৰ যিয়ে পুনেত থাকে আৰু প্ৰতি দেওবাৰে পুৱা ১০ বজাত ফোন কৰে।',
    },
    brx: {
      relationship: 'उन्दै फिसाज्ला',
      voiceNoteText: 'आइ, पुणेनिफ्राय नोंथांनो अननाय जासिबाय। नोंथांनि थाइगिर आचारआ जोबोद गोथाव जादों।',
      hint: 'नोंथांनि उन्दै फिसाज्ला जाय पुणेआव थायो आरो रबिबाराव फोन खालामो।',
    },
    mni: {
      relationship: 'ইবুংঙো (অনৌবা মচানুপা)',
      voiceNoteText: 'ইমা, পুনেদগী অদোমবু নুংশিজরি। অদোম্না থারকখিবা হেইক্রূ হৌম্বা অদু য়াম্না হরাওই।',
      hint: 'পুনেদা লৈবা অদোমগী মচানুপা অমসুং নোংমাইজিং খুদিংদা ফোন তৌবা।',
    },
    lus: {
      relationship: 'Fapa Naupang Ber',
      voiceNoteText: 'Ka Nu, Pune aṭangin duhsakna ka rawn thawn a che. Nimbu siam i rawn thawn kha a tui lutuk.',
      hint: 'I fapa naupang zawk, Pune-a awm, Pathianni chawhma dar 10-a rawn be ziah ṭhin tu che kha.',
    },
    kha: {
      relationship: 'U Khun Khatduh',
      voiceNoteText: 'I Mei, maya na Pune. Ka achar sohphie ba phi phah ka thiang bha.',
      hint: 'U khun khatduh uba sah ha Pune bad uba phone man ka Sngi U Blei step 10.',
    },
    grt: {
      relationship: 'Bi·sa Gitcham',
      voiceNoteText: 'Ama, Puneni ka·saani ra·baha. Nang·ni tiktogipa cha·ani a·char nambegipa ong·a.',
      hint: 'Nang·ni Pune-o donggipa bi·sa, Robibaro phone ka·ronggipa.',
    },
    trp: {
      relationship: 'Kwtwi Bwsala',
      voiceNoteText: 'Ama, Pune ni hamjakma tei nini achar bisingo kwtong nangkha.',
      hint: 'Nini Pune o tongnai bwsala, robibar brum phone khlainai.',
    },
    nag: {
      relationship: 'Chota Lora (Biren)',
      voiceNoteText: 'Maa, Pune pora apuni ke yaad kori ase. Apuni pathaishey aam laga achar bishi bhal lagishey.',
      hint: 'Apuni laga chota lora jun Pune te thakey aru Sunday 10 baje phone korey.',
    },
    ne: {
      relationship: 'कान्छो छोरो',
      voiceNoteText: 'आमा, पुणेबाट सम्झना छ। हजुरले पठाउनुभएको आँपको अचार साह्रै मिठो छ।',
      hint: 'हजुरको कान्छो छोरो जो पुणेमा बस्छ र हरेक आइतबार बिहान १० बजे फोन गर्छ।',
    },
    hi: {
      relationship: 'छोटा बेटा',
      voiceNoteText: 'माँ, पुणे से प्रणाम। आपका भेजा हुआ आम का अचार बहुत ही स्वादिष्ट बना है।',
      hint: 'आपका छोटा बेटा जो पुणे में रहता है और हर रविवार सुबह 10 बजे फोन करता है।',
    },
    en: {
      relationship: 'Loralu (Younger Son)',
      voiceNoteText: 'Maa, thinking of you from Pune. The mango pickle you sent is delicious.',
      hint: 'Your younger son living in Pune who calls every Sunday at 10 AM.',
    },
  },
  'fam-4': {
    as: {
      relationship: 'নাতিনী',
      voiceNoteText: 'আইতা, যোৱা বছৰ আমি একেলগে অঁকা পদুম ফুলৰ ছবিখন চাইছোঁ। মৰম ল’ব!',
      hint: 'আপোনাৰ মৰমৰ নাতিনী যিয়ে আপোনাৰ লগত পদুম ফুলৰ ছবি আঁকি ভাল পায়।',
    },
    brx: {
      relationship: 'नाइथौ नानि',
      voiceNoteText: 'आइता, बोसोराव जों दानाय मोदोमनि सावगारिखौ नायबाय। अननाय लादो!',
      hint: 'नोंथांनि मोदोम नानि जाय नोंथां लोगोसे सावगारि आखिनो मोजां मोनो।',
    },
    mni: {
      relationship: 'ইশু নুপী',
      voiceNoteText: 'ইবেম্মা, মমাং চহীদা ঐখোয় অনি পুন্না য়েৎখিবা থম্বাল লৈগী ফোতো অদু য়েংজরি। মীনুংশি তৌবিয়ু!',
      hint: 'অদোমগা লোয়ননা লাই য়াবা পাম্বা অদোমগী নুংশিরবা ইশু নুপী।',
    },
    lus: {
      relationship: 'Tu (Tunu)',
      voiceNoteText: 'Ka Pi, nikuma kan lemziah dun kha ka lo en mek a. Hmangaihna tam tak ka rawn thawn a che!',
      hint: 'I tunu duat em em, pangpar lem ziahpui che nuam ti thei em em tu kha.',
    },
    kha: {
      relationship: 'Ka Ksuit Kynthei',
      voiceNoteText: 'I Mei, nga peit ia ka dur ba ngi la dro lang ha u snem ba la leit. Maya shibun!',
      hint: 'Ka ksuit kaba maya kaba sngewbha ban dro dur kynthei bad phi.',
    },
    grt: {
      relationship: 'Su·gipa Me·chik',
      voiceNoteText: 'Ambik, re·anggipa bilsio an·chingni nokgimin noksa ko nina man·aha. Ka·saa ra·bo!',
      hint: 'Nang·baksa noksa salgipa nang·ni ka·satgipa su·gipa me·chik.',
    },
    trp: {
      relationship: 'Achu Borok Sa',
      voiceNoteText: 'Achu, khoro bohoro chwng khlai naikha picture no naio. Hamjakma!',
      hint: 'Nini loge photo anai achu bujuk sa.',
    },
    nag: {
      relationship: 'Natini (Poti)',
      voiceNoteText: 'Aita, pichla saal ami duita aakishey padum phul drawing dekhi ase. Morom ahey!',
      hint: 'Apuni laga morom laga poti jun apuni logot drawing banabo bhal pai.',
    },
    ne: {
      relationship: 'नातिनी',
      voiceNoteText: 'हजुरआमा, गत साल हामीले सँगै कोरेको कमलको फूलको चित्र हेर्दैछु। धेरै माया!',
      hint: 'तपाईँकी मायालु नातिनी, जो तपाईँसँग चित्र बनाउन निकै मन पराउँछिन्।',
    },
    hi: {
      relationship: 'पोती',
      voiceNoteText: 'दादी जी, पिछले साल हम दोनों ने जो कमल के फूल की पेंटिंग बनाई थी, उसे देख रही हूँ। बहुत सारा प्यार!',
      hint: 'आपकी प्यारी पोती जो आपके साथ चित्रकारी करना बहुत पसंद करती है।',
    },
    en: {
      relationship: 'Natini (Granddaughter)',
      voiceNoteText: 'Aita, look at the painting we made together last summer. Sending love!',
      hint: 'Your sweet granddaughter who loves drawing water lilies with you.',
    },
  },
  'fam-5': {
    as: {
      relationship: 'ককাইদেউ (জ্যেষ্ঠ ভাতৃ)',
      voiceNoteText: 'ভনীটি, আজি যোৰহাটৰ বাৰীত শীতকালৰ নাৰ্জী ফুল ৰুইছোঁ। মনত পৰিছে।',
      hint: 'যোৰহাটত থকা আপোনাৰ জ্যেষ্ঠ ভাতৃ যিয়ে ফুলৰ বাগিচা আৰু চাহ ভাল পায়।',
    },
    brx: {
      relationship: 'आदा (गेदेर आदा)',
      voiceNoteText: 'आदा, दिनै जरहातनि बारियाव बिलाइ बिखुं फानबाय। गोसोखांफैदों।',
      hint: 'जरहातआव थानाय नोंथांनि गेदेर आदा जाय बारि आरो साहा मोजां मोनो।',
    },
    mni: {
      relationship: 'ইয়াম্বা',
      voiceNoteText: 'ইচে, ঙসি জোরহাতকী লৈকোলদা কুন্দো লৈ থারি। অদোমবু নিংশিংই।',
      hint: 'জোরহাত্তা লৈবা অদোমগী মচিন-মনাও অহনবা অমসুং লৈকোল পাম্বা।',
    },
    lus: {
      relationship: 'Upa Ber (Upa)',
      voiceNoteText: 'Ka nau, vawiinah Jorhat huanah pangpar ka phun a. Ka ngai hle mai che.',
      hint: 'Jorhat-a i u upa ber, huan siam leh thingpui in ngaina em em tu kha.',
    },
    kha: {
      relationship: 'U Bah Heh',
      voiceNoteText: 'Kong, mynta ka sngi nga thung syntiew ha kper ha Jorhat. Kynmaw ia phi.',
      hint: 'U hymmen jong phi ha Jorhat uba sngewbha ia ka kper bad ka sha.',
    },
    grt: {
      relationship: 'Ada Dal·gipa',
      voiceNoteText: 'Noba, da·al Jorhat buringo bibal ge·aha. Nang·ko gisik ra·a.',
      hint: 'Jorhat-o donggipa nang·ni dal·gipa ada.',
    },
    trp: {
      relationship: 'Kotor Tada',
      voiceNoteText: 'Achu bukhuk, tini Jorhat bario khumpui gainai. Nono uaisa naikha.',
      hint: 'Jorhat o tongnai tada jora bagan hamjaknai.',
    },
    nag: {
      relationship: 'Kokaideu (Daang Bhai)',
      voiceNoteText: 'Boina, aji Jorhat laga bagan te phul lagai ase. Yaad ahey apuni ke.',
      hint: 'Jorhat te thaka apuni laga daang bhai jun phul laga aru chaa bhal pai.',
    },
    ne: {
      relationship: 'ठूलो दाइ',
      voiceNoteText: 'बहिनी, आज जोरहाटको बगैँचामा सयपत्री फूल रोप्दैछु। तिम्रो सम्झना आयो।',
      hint: 'जोरहाटमा बस्नुहुने हजुरको ठूलो दाजु, जसलाई बगैँचा र चिया असाध्यै मनपर्छ।',
    },
    hi: {
      relationship: 'बड़े भाई',
      voiceNoteText: 'बहना, आज जोरहाट के बगीचे में गेंदे के फूल रोप रहा हूँ। तुम्हारी बहुत याद आ रही है।',
      hint: 'जोरहाट में रहने वाले आपके बड़े भाई, जिन्हें बागवानी और चाय बेहद पसंद है।',
    },
    en: {
      relationship: 'Kokaideu (Elder Brother)',
      voiceNoteText: 'Sister, planting the winter marigolds in Jorhat garden today.',
      hint: 'Your elder brother in Jorhat who loves gardening and tea.',
    },
  },
};

export const getLocalizedFamilyMember = (member: FamilyMember, lang: LanguageCode): { relationship: string; voiceNoteText: string; hint: string } => {
  const found = FAMILY_TRANSLATIONS[member.id]?.[lang];
  if (found) {
    return found;
  }
  return {
    relationship: member.relationship,
    voiceNoteText: member.voiceNoteText,
    hint: member.hint,
  };
};

// ============================================================================
// 3. TODAY SCREEN GENERAL UI STRINGS
// ============================================================================

export const getTodayUiStrings = (lang: LanguageCode) => {
  const dict: Record<LanguageCode, {
    aiCompanion: string;
    aiCompanionSub: string;
    speakWithSmriti: string;
    aiVoice: string;
    addVoiceReminder: string;
    voiceReminderBadge: string;
    snoozed: string;
    delivered: string;
    daily: string;
    once: string;
    voiceReminderCardTitle: string;
    voiceReminderCardDesc: string;
    recordVoiceBtn: string;
  }> = {
    as: {
      aiCompanion: 'এআই সংগী',
      aiCompanionSub: 'স্মৃতিৰ সৈতে কথা পাতক—আপোনাৰ মৰমৰ সংগী, যিয়ে কথা শুনে আৰু সকলো মনত পেলাই দিয়ে।',
      speakWithSmriti: 'স্মৃতিৰ সৈতে কথা পাতক',
      aiVoice: 'এআই কণ্ঠ',
      addVoiceReminder: '+ কণ্ঠৰে স্মাৰক',
      voiceReminderBadge: 'কণ্ঠৰে স্মাৰক',
      snoozed: 'পলম কৰা হৈছে',
      delivered: 'বাজি উঠিছে',
      daily: 'দৈনিক',
      once: 'এবাৰ',
      voiceReminderCardTitle: 'কণ্ঠৰে মনত পেলোৱা',
      voiceReminderCardDesc: 'আপোনাৰ নিজৰ কণ্ঠৰে যিকোনো সময়ৰ বাবে বাৰ্তা বাণীবদ্ধ কৰক, আৰু সেই সময়ত স্পষ্টকৈ শুনক।',
      recordVoiceBtn: 'কণ্ঠৰে স্মাৰক বাণীবদ্ধ কৰক',
    },
    brx: {
      aiCompanion: 'एआइ लोगो',
      aiCompanionSub: 'स्मृतीजों रायलाय—नोंथांनि अनजालु लोगो, जाय खोनासंयो आरो गासै गोसोखां होयो।',
      speakWithSmriti: 'स्मृतीजों रायलाय',
      aiVoice: 'एआइ राव',
      addVoiceReminder: '+ रावजों गोसोखां होनाय',
      voiceReminderBadge: 'रावजों गोसोखां होनाय',
      snoozed: 'नेहोनाय',
      delivered: 'जाफुंबाय',
      daily: 'सानफ्रोमबो',
      once: 'खेबसे',
      voiceReminderCardTitle: 'रावजों गोसोखां होनाय',
      voiceReminderCardDesc: 'नोंथांनि गावनि रावजों गोसोखां बाथ्रा रेकर्ड खालाम, आरो समाव खोनासं।',
      recordVoiceBtn: 'राव रेकर्ड खालाम',
    },
    mni: {
      aiCompanion: 'এআই মরুপ',
      aiCompanionSub: 'স্মৃতিগা ৱারী শানৌ—অদোমগী নুংশিরবা মরুপনি, ৱারী তাবা অমসুং নিংশিংবা।',
      speakWithSmriti: 'স্মৃতিগা ৱারী শানৌ',
      aiVoice: 'এআই খোঞ্জেল',
      addVoiceReminder: '+ খোঞ্জেলগী স্মারক',
      voiceReminderBadge: 'খোঞ্জেলগী স্মারক',
      snoozed: 'লেপখ্রিবা',
      delivered: 'তাখ্রে',
      daily: 'নুমিৎ খুদিংগী',
      once: 'অমুক্তা',
      voiceReminderCardTitle: 'খোঞ্জেলগী স্মারক',
      voiceReminderCardDesc: 'অদোমগী মশাগী খোঞ্জেলদা ৱারী রেকোৰ্ড তৌদুনা মতম খক্তা তারসি।',
      recordVoiceBtn: 'খোঞ্জেল রেকোৰ্ড তৌ',
    },
    lus: {
      aiCompanion: 'AI Ṭhian',
      aiCompanionSub: 'Smriti be rawh—ngun taka ngaithla tu leh hriatrengna kawnga ṭhian ṭha ber a ni.',
      speakWithSmriti: 'Smriti Be Rawh',
      aiVoice: 'AI Aw',
      addVoiceReminder: '+ Aw Hriattirna',
      voiceReminderBadge: 'Aw Hriattirna',
      snoozed: 'Nghah mek',
      delivered: 'Ri tawh',
      daily: 'Nitin',
      once: 'Vawikhat',
      voiceReminderCardTitle: 'Aw Hriattirna Siamna',
      voiceReminderCardDesc: 'I aw ngeiin hriattirna insiam la, a hun takah a rawn ri chhuak ang.',
      recordVoiceBtn: 'Aw Record Rawh',
    },
    kha: {
      aiCompanion: 'U Paralok AI',
      aiCompanionSub: 'Kren bad ka Smriti—ka paralok kaba sngap bad kaba pynkynmaw ia kiei kiei baroh.',
      speakWithSmriti: 'Kren bad ka Smriti',
      aiVoice: 'Ka Sur AI',
      addVoiceReminder: '+ Ka Jingkynmaw da ka Sur',
      voiceReminderBadge: 'Jingkynmaw Sur',
      snoozed: 'Pynslem',
      delivered: 'La kren',
      daily: 'Man ka sngi',
      once: 'Shisien',
      voiceReminderCardTitle: 'Ka Jingkynmaw da ka Sur',
      voiceReminderCardDesc: 'Record ia ka sur jong phi ban pynkynmaw ha ka por kaba biang.',
      recordVoiceBtn: 'Record Sur',
    },
    grt: {
      aiCompanion: 'AI Rorim·gipa',
      aiCompanionSub: 'Smritiko aganbo—nang·ni knatimgipa aro gisik ra·atgipa rorim·gipa.',
      speakWithSmriti: 'Smritiko Aganbo',
      aiVoice: 'AI Ku·rang',
      addVoiceReminder: '+ Ku·rangchi Gual·atani',
      voiceReminderBadge: 'Ku·rangchi Reminder',
      snoozed: 'Ru·uta',
      delivered: 'Sokaha',
      daily: 'Salanti',
      once: 'Changsa',
      voiceReminderCardTitle: 'Ku·rangchi Reminder',
      voiceReminderCardDesc: 'Nang·ni ku·rangchi record ka·bo aro somoio knabo.',
      recordVoiceBtn: 'Ku·rang Record Ka·bo',
    },
    trp: {
      aiCompanion: 'AI Yaguk',
      aiCompanionSub: 'Smriti bai kok saldi—nini kaham yaguk, nono khna nai tei uaisa rinai.',
      speakWithSmriti: 'Smriti bai Kok Saldi',
      aiVoice: 'AI Khorang',
      addVoiceReminder: '+ Khorang bai Kok',
      voiceReminderBadge: 'Khorang Reminder',
      snoozed: 'Yaphai tong',
      delivered: 'Phaikha',
      daily: 'Sal brum',
      once: 'Kaisa',
      voiceReminderCardTitle: 'Khorang bai Kok',
      voiceReminderCardDesc: 'Nini khorang bai record khlaidi tei somoio khnadi.',
      recordVoiceBtn: 'Khorang Record Khlaidi',
    },
    nag: {
      aiCompanion: 'AI Sathi',
      aiCompanionSub: 'Smriti logot kotha koribi—apuni laga morom sathi, sob suni ase aru yaad korai diye.',
      speakWithSmriti: 'Smriti logot Kotha Koribi',
      aiVoice: 'AI Awaz',
      addVoiceReminder: '+ Voice Reminder',
      voiceReminderBadge: 'Voice Reminder',
      snoozed: 'Derite bajibo',
      delivered: 'Bajishey',
      daily: 'Protidin',
      once: 'Ekbahr',
      voiceReminderCardTitle: 'Voice Reminder Banabi',
      voiceReminderCardDesc: 'Apuni laga nijor awaz te reminder record koribi aru time te sunibi.',
      recordVoiceBtn: 'Voice Record Koribi',
    },
    ne: {
      aiCompanion: 'एआई साथी',
      aiCompanionSub: 'स्मृतिसँग कुरा गर्नुहोस्—हजुरको मायालु साथी, जसले सुन्छ र सबै कुरा याद दिलाउँछ।',
      speakWithSmriti: 'स्मृतिसँग कुरा गर्नुहोस्',
      aiVoice: 'एआई आवाज',
      addVoiceReminder: '+ स्वर रिमाइन्डर',
      voiceReminderBadge: 'स्वर रिमाइन्डर',
      snoozed: 'पछि सारिएको',
      delivered: 'बजाइसकियो',
      daily: 'दैनिक',
      once: 'एकपटक',
      voiceReminderCardTitle: 'आफ्नै स्वरमा रिमाइन्डर',
      voiceReminderCardDesc: 'आफ्नै आवाजमा सन्देश रेकर्ड गर्नुहोस् र तोकिएको समयमा सुन्नुहोस्।',
      recordVoiceBtn: 'आवाज रेकर्ड गर्नुहोस्',
    },
    hi: {
      aiCompanion: 'एआई साथी',
      aiCompanionSub: 'स्मृति से सीधे बात करें—आपकी प्यारी साथी जो ध्यान से सुनती है और सब याद दिलाती है।',
      speakWithSmriti: 'स्मृति से बात करें',
      aiVoice: 'एआई आवाज़',
      addVoiceReminder: '+ वॉइस रिमाइंडर',
      voiceReminderBadge: 'वॉइस रिमाइंडर',
      snoozed: 'स्नूज़ किया गया',
      delivered: 'सुनाई गई',
      daily: 'प्रतिदिन',
      once: 'एक बार',
      voiceReminderCardTitle: 'वॉइस रिमाइंडर जोड़ें',
      voiceReminderCardDesc: 'अपनी ही आवाज़ में कोई भी याद रखने वाली बात रिकॉर्ड करें और तय समय पर सुनें।',
      recordVoiceBtn: 'वॉइस रिमाइंडर रिकॉर्ड करें',
    },
    en: {
      aiCompanion: 'AI Companion',
      aiCompanionSub: 'Talk directly with Smriti, your caring AI companion for memory, routine, and conversation.',
      speakWithSmriti: 'Speak with Smriti',
      aiVoice: 'AI Voice',
      addVoiceReminder: '+ Voice Reminder',
      voiceReminderBadge: 'Voice Reminder',
      snoozed: 'Snoozed',
      delivered: 'Delivered',
      daily: 'Daily',
      once: 'Once',
      voiceReminderCardTitle: 'Voice Reminder',
      voiceReminderCardDesc: 'Record a spoken reminder message in your own voice, set any time, and hear it play automatically.',
      recordVoiceBtn: 'Record Voice Reminder',
    },
  };

  return dict[lang] || dict.en;
};

// ============================================================================
// 4. GAMES LIST & INDIVIDUAL GAMES LOCALIZATION
// ============================================================================

export interface LocalizedGameDef {
  title: string;
  subtitle: string;
  duration: string;
}

const GAMES_TRANSLATIONS: Record<string, Record<LanguageCode, LocalizedGameDef>> = {
  uno_game: {
    as: { title: 'ইউনো খেল', subtitle: 'ৰং আৰু সংখ্যাৰ মিল কৰি কাৰ্ড খেলক', duration: '৫ মিনিট' },
    brx: { title: 'युनो गेलेनाय', subtitle: 'गाब आरो अनजिमा मिलिनाय कार्ड गेले', duration: '५ मिनिट' },
    mni: { title: 'ইউনো শান্নবা', subtitle: 'মচু অমসুং মশীং য়ান্নবা কাৰ্ড শান্নবা', duration: 'পুংফম ৫' },
    lus: { title: 'UNO Card Khelh', subtitle: 'Rawng leh number inmil rem khawm', duration: 'Min 5' },
    kha: { title: 'Ka Jingialehkai UNO', subtitle: 'Pyniahap ia ki rong bad ki jingkhein', duration: 'Min 5' },
    grt: { title: 'UNO Kalani', subtitle: 'Rong aro numberko meliatgipa kal·ani', duration: 'Min 5' },
    trp: { title: 'UNO Khlengma', subtitle: 'Rong tei lekha milina khlengma', duration: 'Min 5' },
    nag: { title: 'UNO Game', subtitle: 'Rang aru number milai kene khelebi', duration: '5 min' },
    ne: { title: 'युनो खेल', subtitle: 'रङ्ग र अङ्क मिलाएर तास खेल्नुहोस्', duration: '५ मिनेट' },
    hi: { title: 'यूनो गेम', subtitle: 'रंग और संख्या मिलाकर कार्ड खेलें', duration: '5 मिनट' },
    en: { title: 'UNO Game Night', subtitle: 'Match colors & numbers vs bots with card animations and sound effects', duration: '5 min' },
  },
  target_spotting: {
    as: { title: 'ৰং আৰু আকৃতি চিনাক্তকৰণ', subtitle: 'নিৰ্দিষ্ট ৰং বা আকৃতি বাছি উলিয়াওক', duration: '৩ মিনিট' },
    brx: { title: 'गाब आरो महर नायगिरनाय', subtitle: 'महर आरो गाबखौ थिखालामना गेले', duration: '३ मिनिट' },
    mni: { title: 'মচু অমসুং শক্লোন খঙদোকপা', subtitle: 'মচু নত্রগা শক্লোন য়েংদুনা খল্লু', duration: 'পুংফম ৩' },
    lus: { title: 'Bih Kual Zawng Chhuak', subtitle: 'Rawng leh a pianhmang inmil zawng rawh', duration: 'Min 3' },
    kha: { title: 'Wad ia ki Rong bad Dur', subtitle: 'Tep tang ia kiba iadei bad ka target', duration: 'Min 3' },
    grt: { title: 'Rong aro Bimangko Am·ani', subtitle: 'Gualaniko chelatani kal·ani', duration: 'Min 3' },
    trp: { title: 'Rong tei Mohor Saikha', subtitle: 'Rong tei mohor bai milina naidi', duration: 'Min 3' },
    nag: { title: 'Rang aru Shape Dhoribi', subtitle: 'Milua shape khan touch koribi', duration: '3 min' },
    ne: { title: 'आकार र रङ्ग पहिचान', subtitle: 'मिल्ने आकार र रङ्ग पत्ता लगाउनुहोस्', duration: '३ मिनेट' },
    hi: { title: 'रंग और आकार पहचान', subtitle: 'लक्ष्य से मेल खाने वाले आकारों पर टैप करें', duration: '3 मिनट' },
    en: { title: 'Target & Color Spotting', subtitle: 'Tap only the shapes that match the target', duration: '3 min' },
  },
  pattern_recall: {
    as: { title: 'ক্ৰম সোঁৱৰণী খেল', subtitle: 'জ্বলি উঠা ঘৰবোৰ চাই ক্ৰম অনুসৰি টিপক', duration: '৩ মিনিট' },
    brx: { title: 'सावगारि गोसोखां गेलेनाय', subtitle: 'सोरां जाबोनाय खथानिफ्राय फारियै सोदोब', duration: '३ मिनिट' },
    mni: { title: 'থৌওং নিংশিংবা শান্নবা', subtitle: 'মঙাল থোক্লকপা অদু য়েংদুনা মথং মনাও তৌ', duration: 'পুংফম ৩' },
    lus: { title: 'Hriatrengna Khelh', subtitle: 'Bawm eng te kha a indawtin hmet rawh', duration: 'Min 3' },
    kha: { title: 'Kynmaw ia ka Rukom', subtitle: 'Peit ia ki synduk ba meh bad tep lang', duration: 'Min 3' },
    grt: { title: 'Gisik Ra·ani Kal·ani', subtitle: 'Bikotani baksa riko am·ani', duration: 'Min 3' },
    trp: { title: 'Mohor Gosongma Khlengma', subtitle: 'Bar phainai khorong naidi tei tekdi', duration: 'Min 3' },
    nag: { title: 'Pattern Yaad Kora Game', subtitle: 'Jolua box khan dekhi kene thik order te dababi', duration: '3 min' },
    ne: { title: 'ढाँचा सम्झने खेल', subtitle: 'बाकस बलेको क्रम हेरी पालैपालो थिच्नुहोस्', duration: '३ मिनेट' },
    hi: { title: 'क्रम स्मरण खेल', subtitle: 'रोशन होने वाले डिब्बों को देखकर सही क्रम में टैप करें', duration: '3 मिनट' },
    en: { title: 'Pattern Recall', subtitle: 'Watch the boxes light up, then tap in order', duration: '3 min' },
  },
};

export const getLocalizedGameDef = (gameId: string, lang: LanguageCode): LocalizedGameDef => {
  return GAMES_TRANSLATIONS[gameId]?.[lang] || GAMES_TRANSLATIONS[gameId]?.en || { title: gameId, subtitle: '', duration: '' };
};

// ============================================================================
// 5. VOICE REMINDER MODAL & ALARM STRINGS
// ============================================================================

export const getVoiceReminderStrings = (lang: LanguageCode) => {
  const dict: Record<LanguageCode, {
    modalTitle: string;
    recordingTitle: string;
    recordPrompt: string;
    recordingDesc: string;
    speakClearly: string;
    tapToStart: string;
    tapToStop: string;
    timePrompt: string;
    timeDesc: string;
    hour: string;
    minute: string;
    today: string;
    tomorrow: string;
    confirmBtn: string;
    alarmTitle: string;
    stopAlarm: string;
    snoozeAlarm: string;
  }> = {
    as: {
      modalTitle: 'কণ্ঠৰে স্মাৰক',
      recordingTitle: 'আপোনাৰ কণ্ঠ বাণীবদ্ধ হৈছে...',
      recordPrompt: 'কণ্ঠৰে স্মাৰক বাণীবদ্ধ কৰক',
      recordingDesc: 'তলৰ বুটাম টিপি আপোনাৰ স্মাৰক কওক। সেইটো আপোনাৰ নিজৰ কণ্ঠৰে বাজিব!',
      speakClearly: 'মাইক্ৰ’ফোনত স্পষ্টকৈ কওক। শেষ হ’লে বন্ধ কৰক।',
      tapToStart: 'বাণীবদ্ধ কৰিবলৈ টিপক',
      tapToStop: 'বন্ধ কৰিবলৈ টিপক',
      timePrompt: 'এই স্মাৰক কেতিয়া বাজিব?',
      timeDesc: 'তলত সময় বাছি লওক:',
      hour: 'ঘণ্টা',
      minute: 'মিনিট',
      today: 'আজি',
      tomorrow: 'কাইলৈ',
      confirmBtn: 'নিশ্চিত কৰক আৰু স্মাৰক সাজু কৰক',
      alarmTitle: 'কণ্ঠৰে স্মাৰক বাজি উঠিছে',
      stopAlarm: 'বন্ধ কৰক',
      snoozeAlarm: '১০ মিনিট পিছত পুনৰ কওক',
    },
    brx: {
      modalTitle: 'रावजों गोसोखां होनाय',
      recordingTitle: 'नोंथांनि राव रेकर्ड जागासिनो...',
      recordPrompt: 'रावजों गोसोखां होनाय रेकर्ड खालाम',
      recordingDesc: 'बुटाम थुनानै बाथ्रा बुं। नोंथांनि गावनि रावजोंनो दामगोन!',
      speakClearly: 'माइकआव रोखा बुं। जोबबा थुनानै दोन।',
      tapToStart: 'रेकर्ड खालामनो थु',
      tapToStop: 'दोननो थु',
      timePrompt: 'बे गोसोखां होनाया माब्ला दामगोन?',
      timeDesc: 'गाहायाव समाव सायख’:',
      hour: 'घन्टा',
      minute: 'मिनिट',
      today: 'दिनै',
      tomorrow: 'गाबोन',
      confirmBtn: 'थि खालाम',
      alarmTitle: 'रावजों गोसोखां होनाय दामबाय',
      stopAlarm: 'दोन',
      snoozeAlarm: '१० मिनिट उनाव फिन',
    },
    mni: {
      modalTitle: 'খোঞ্জেলগী স্মারক',
      recordingTitle: 'অদোমগী খোঞ্জেল রেকোৰ্ড তৌরি...',
      recordPrompt: 'খোঞ্জেলগী স্মারক রেকোৰ্ড তৌ',
      recordingDesc: 'বুতন অসি নমহন্দুনা অদোমগী খোঞ্জেল রেকোৰ্ড তৌবীয়ু।',
      speakClearly: 'মাইক্রোফোন্দা শাফনা ঙাংবীয়ু।',
      tapToStart: 'রেকোৰ্ড তৌনবা নম্মু',
      tapToStop: 'লেপ্নবা নম্মু',
      timePrompt: 'স্মারক অসি করম্বা মতমদা তাগনি?',
      timeDesc: 'মতম খল্লু:',
      hour: 'পুং',
      minute: 'মিনিত',
      today: 'ঙসি',
      tomorrow: 'হায়েন',
      confirmBtn: 'থৌরাং তৌ',
      alarmTitle: 'খোঞ্জেলগী স্মারক তারসি',
      stopAlarm: 'লেপহল্লু',
      snoozeAlarm: 'মিনিত ১০ গী মতুংদা অমুক',
    },
    lus: {
      modalTitle: 'Aw Hriattirna',
      recordingTitle: 'I aw record mek a ni...',
      recordPrompt: 'Aw Hriattirna Siam Rawh',
      recordingDesc: 'Hnuai lama button hmet la, i aw ngeiin sawi rawh.',
      speakClearly: 'Chiang takin sawi la, zawh velah tawp rawh.',
      tapToStart: 'Record ṭan rawh',
      tapToStop: 'Tawp rawh',
      timePrompt: 'Engtikah nge a rik ang?',
      timeDesc: 'A rik hun tur thlang rawh:',
      hour: 'Dar',
      minute: 'Minut',
      today: 'Vawiin',
      tomorrow: 'Naktuk',
      confirmBtn: 'Siam fel rawh',
      alarmTitle: 'Aw Hriattirna a ri mek',
      stopAlarm: 'Tawp tir rawh',
      snoozeAlarm: 'Minut 10 hnuah ri leh rawh se',
    },
    kha: {
      modalTitle: 'Ka Jingkynmaw da ka Sur',
      recordingTitle: 'Dang record ia ka sur...',
      recordPrompt: 'Record Jingkynmaw Sur',
      recordingDesc: 'Tep ia u button bad kren. Kan riw da ka sur jong phi.',
      speakClearly: 'Kren shai bha ha u mic.',
      tapToStart: 'Tep ban record',
      tapToStop: 'Tep ban sangeh',
      timePrompt: 'Lano kan riew?',
      timeDesc: 'Jied ia ka por:',
      hour: 'Kynta',
      minute: 'Minit',
      today: 'Mynta',
      tomorrow: 'Lashai',
      confirmBtn: 'Pynskhem',
      alarmTitle: 'Ka Jingkynmaw ka la riew',
      stopAlarm: 'Sangeh',
      snoozeAlarm: 'Pynslem 10 minit',
    },
    grt: {
      modalTitle: 'Ku·rangchi Reminder',
      recordingTitle: 'Ku·rangko record ka·enga...',
      recordPrompt: 'Ku·rang Reminder Record Ka·bo',
      recordingDesc: 'Buttonko thikate aganbo. Nang·ni ku·rangon ring·gen.',
      speakClearly: 'Mic-o rong·tale aganbo.',
      tapToStart: 'Record ka·na thikbo',
      tapToStop: 'Dondikbo',
      timePrompt: 'Basako ring·gen?',
      timeDesc: 'Somoiko seokbo:',
      hour: 'Kynta',
      minute: 'Minit',
      today: 'Da·al',
      tomorrow: 'Gipin sal',
      confirmBtn: 'Thik ka·bo',
      alarmTitle: 'Ku·rang Reminder ring·enga',
      stopAlarm: 'Dondikbo',
      snoozeAlarm: 'Minit 10 ja·man ring·taibo',
    },
    trp: {
      modalTitle: 'Khorang Reminder',
      recordingTitle: 'Khorang record wangkha...',
      recordPrompt: 'Khorang Reminder Record Khlaidi',
      recordingDesc: 'Button nange kok sa. Nini khorang baise ringnai.',
      speakClearly: 'Mico sa-kahalo sadi.',
      tapToStart: 'Record khlaino tekdi',
      tapToStop: 'Don-di',
      timePrompt: 'Omo basakhe ringnai?',
      timeDesc: 'Somoi saikha:',
      hour: 'Ghonta',
      minute: 'Minit',
      today: 'Tini',
      tomorrow: 'Khna',
      confirmBtn: 'Thik khlai',
      alarmTitle: 'Khorang Reminder ringkha',
      stopAlarm: 'Don-di',
      snoozeAlarm: '10 minit pichete uaisa',
    },
    nag: {
      modalTitle: 'Voice Reminder',
      recordingTitle: 'Awaz record hoiahey...',
      recordPrompt: 'Voice Reminder Record Koribi',
      recordingDesc: 'Button dabai kene kotha kobo. Nijor awaz te bajibo!',
      speakClearly: 'Mic te saaf pora kobi. Shesh hoile bondho koribi.',
      tapToStart: 'Record koribole dababi',
      tapToStop: 'Bondho koribole dababi',
      timePrompt: 'Kimaan time te bajibo?',
      timeDesc: 'Time chunibi:',
      hour: 'Ghonta',
      minute: 'Minute',
      today: 'Aji',
      tomorrow: 'Kaali',
      confirmBtn: 'Thik Kori Dibi',
      alarmTitle: 'Voice Reminder Bajishey',
      stopAlarm: 'Bondho Kori Dibi',
      snoozeAlarm: '10 minute pichete ahibi',
    },
    ne: {
      modalTitle: 'स्वर रिमाइन्डर',
      recordingTitle: 'हजुरको आवाज रेकर्ड हुँदैछ...',
      recordPrompt: 'आवाजमा रिमाइन्डर रेकर्ड गर्नुहोस्',
      recordingDesc: 'तलको बटन थिचेर सन्देश बोल्नुहोस्। यो हजुरकै आवाजमा बज्नेछ!',
      speakClearly: 'माइकमा प्रस्ट बोल्नुहोस्। सकिएपछि रोक्नुहोस्।',
      tapToStart: 'रेकर्ड गर्न थिच्नुहोस्',
      tapToStop: 'रोक्न थिच्नुहोस्',
      timePrompt: 'यो रिमाइन्डर कहिले बज्नेछ?',
      timeDesc: 'समय चयन गर्नुहोस्:',
      hour: 'घन्टा',
      minute: 'मिनेट',
      today: 'आज',
      tomorrow: 'भोलि',
      confirmBtn: 'रिमाइन्डर निश्चित गर्नुहोस्',
      alarmTitle: 'स्वर रिमाइन्डर बज्यो',
      stopAlarm: 'बन्द गर्नुहोस्',
      snoozeAlarm: '१० मिनेटपछि फेरि सम्झाउनुहोस्',
    },
    hi: {
      modalTitle: 'वॉइस रिमाइंडर',
      recordingTitle: 'आपकी आवाज़ रिकॉर्ड हो रही है...',
      recordPrompt: 'वॉइस रिमाइंडर रिकॉर्ड करें',
      recordingDesc: 'नीचे का बटन दबाकर अपना संदेश बोलें। यह आपकी ही आवाज़ में बजेगा!',
      speakClearly: 'माइक में साफ़-साफ़ बोलें। पूरा होने पर रोकें।',
      tapToStart: 'रिकॉर्ड करने के लिए टैप करें',
      tapToStop: 'रोकने के लिए टैप करें',
      timePrompt: 'यह रिमाइंडर कब बजना चाहिए?',
      timeDesc: 'नीचे समय चुनें:',
      hour: 'घंटा',
      minute: 'मिनट',
      today: 'आज',
      tomorrow: 'कल',
      confirmBtn: 'रिमाइंडर सेट करें',
      alarmTitle: 'वॉइस रिमाइंडर अलार्म बज रहा है',
      stopAlarm: 'अलार्म बंद करें',
      snoozeAlarm: '10 मिनट बाद फिर याद दिलाएँ',
    },
    en: {
      modalTitle: 'Voice Reminder',
      recordingTitle: 'Recording your voice...',
      recordPrompt: 'Record Voice Reminder',
      recordingDesc: 'Tap the button below and speak your reminder. It will play back in your own voice!',
      speakClearly: 'Speak clearly into your microphone. Tap stop when finished.',
      tapToStart: 'Tap to start recording',
      tapToStop: 'Tap to stop recording',
      timePrompt: 'What time should this play?',
      timeDesc: 'Select preferred time:',
      hour: 'Hour',
      minute: 'Minute',
      today: 'Today',
      tomorrow: 'Tomorrow',
      confirmBtn: 'Confirm & Set Reminder',
      alarmTitle: 'Voice Reminder Alarm',
      stopAlarm: 'Stop Alarm',
      snoozeAlarm: 'Remind me in 10 minutes',
    },
  };

  return dict[lang] || dict.en;
};

// ============================================================================
// 4. TODAY TAB UI STRINGS
// ============================================================================

export interface TodayTabUiStrings {
  aiCompanionBadge: string;
  aiCompanionDesc: string;
  speakWithSmritiBtn: string;
  aiVoiceBadge: string;
  addVoiceReminderBtn: string;
  voiceReminderCardTitle: string;
  voiceReminderCardDesc: string;
  recordVoiceReminderBtn: string;
  snoozedBadge: string;
  deliveredBadge: string;
  playSlideshow: string;
  pauseSlideshow: string;
}

export const getTodayTabUiStrings = (lang: LanguageCode): TodayTabUiStrings => {
  const dict: Record<LanguageCode, TodayTabUiStrings> = {
    as: {
      aiCompanionBadge: 'AI সংগী',
      aiCompanionDesc: 'স্মৃতিৰ সৈতে পোনপটীয়াকৈ কথা পাতক—মনত পেলাবলৈ, দৈনন্দিন নিয়ম আৰু আনন্দদায়ক কথা-বতৰাৰ বাবে আপোনাৰ মৰমৰ AI সংগী।',
      speakWithSmritiBtn: 'স্মৃতিৰ সৈতে কথা পাতক',
      aiVoiceBadge: 'AI কণ্ঠস্বৰ',
      addVoiceReminderBtn: '+ কণ্ঠস্বৰ স্মাৰক',
      voiceReminderCardTitle: 'কণ্ঠস্বৰ স্মাৰক',
      voiceReminderCardDesc: 'আপোনাৰ নিজৰ কণ্ঠস্বৰত স্মাৰক বাৰ্তা ৰেকৰ্ড কৰক, সময় বাছক, আৰু সেই সময়ত আপোনাৰ কণ্ঠস্বৰতে নিজে নিজে বাজি উঠিব।',
      recordVoiceReminderBtn: 'কণ্ঠস্বৰ স্মাৰক ৰেকৰ্ড কৰক',
      snoozedBadge: 'পিছুওৱা হ’ল',
      deliveredBadge: 'সম্পূৰ্ণ হ’ল',
      playSlideshow: 'ছবিসমূহ চাওক',
      pauseSlideshow: 'ৰখাওক',
    },
    hi: {
      aiCompanionBadge: 'AI साथी',
      aiCompanionDesc: 'स्मृति से सीधे बात करें—स्मृति, दिनचर्या और बातचीत के लिए आपकी प्यारी AI साथी।',
      speakWithSmritiBtn: 'स्मृति से बात करें',
      aiVoiceBadge: 'AI आवाज़',
      addVoiceReminderBtn: '+ वॉइस रिमाइंडर',
      voiceReminderCardTitle: 'वॉइस रिमाइंडर',
      voiceReminderCardDesc: 'अपनी आवाज़ में रिमाइंडर संदेश रिकॉर्ड करें, कोई भी समय चुनें और नियत समय पर यह अपने आप बजेगा।',
      recordVoiceReminderBtn: 'वॉइस रिमाइंडर रिकॉर्ड करें',
      snoozedBadge: 'स्थगित',
      deliveredBadge: 'पूरा हुआ',
      playSlideshow: 'तस्वीरें देखें',
      pauseSlideshow: 'रोकें',
    },
    en: {
      aiCompanionBadge: 'AI Companion',
      aiCompanionDesc: 'Talk directly with Smriti, your caring AI companion for memory, routine, and conversation.',
      speakWithSmritiBtn: 'Speak with Smriti',
      aiVoiceBadge: 'AI Voice',
      addVoiceReminderBtn: '+ Voice Reminder',
      voiceReminderCardTitle: 'Voice Reminder',
      voiceReminderCardDesc: 'Record a spoken reminder message in your own voice, set any time, and hear it play automatically.',
      recordVoiceReminderBtn: 'Record Voice Reminder',
      snoozedBadge: 'Snoozed',
      deliveredBadge: 'Delivered',
      playSlideshow: 'Play Slideshow',
      pauseSlideshow: 'Pause',
    },
    brx: {
      aiCompanionBadge: 'AI लोगो',
      aiCompanionDesc: 'स्मृतिजों थोंजों बाथ्रा सावराय—गोसोखां होनाय आरो सानफ्रोमबोनि बाथ्रानि थाखाय नोंथांनि अनजालु AI लोगो।',
      speakWithSmritiBtn: 'स्मृतिजों सावराय',
      aiVoiceBadge: 'AI गांराव',
      addVoiceReminderBtn: '+ गांराव गोसोखां',
      voiceReminderCardTitle: 'गांराव गोसोखां होनाय',
      voiceReminderCardDesc: 'गावनि गांरावजों गोसोखां रेकर्ड खालाम, जेखि जाया सम सायख’ आरो थार समाव गावबागाव बाजायगोन।',
      recordVoiceReminderBtn: 'गांराव गोसोखां रेकर्ड खालाम',
      snoozedBadge: 'लासैनि',
      deliveredBadge: 'जाफुंबाय',
      playSlideshow: 'सावगारि नुहुर',
      pauseSlideshow: 'दोनथ’',
    },
    mni: {
      aiCompanionBadge: 'AI মরূপ',
      aiCompanionDesc: 'স্মৃতিগা হকথেংননা ৱারী শানবীয়ু—নীংশিংবা, নোংমগী থবক অমসুং পুক্নিং নুংঙাইহন্নবা অদোমগী নুংশিরবা AI মরূপ।',
      speakWithSmritiBtn: 'স্মৃতিগা ৱারী শানবীয়ু',
      aiVoiceBadge: 'AI খোঞ্জেল',
      addVoiceReminderBtn: '+ খোঞ্জেলগী স্মারক',
      voiceReminderCardTitle: 'খোঞ্জেলগী স্মারক',
      voiceReminderCardDesc: 'অদোমগী মশাগী খোঞ্জেলদা স্মারক অমা রেকোৰ্দ তৌবীয়ু, মতম লেপপীয়ু, অমসুং মতম চানা মশানা লাউথোক্কনি।',
      recordVoiceReminderBtn: 'খোঞ্জেলগী স্মারক রেকোৰ্দ তৌবীয়ু',
      snoozedBadge: 'লেপহল্লে',
      deliveredBadge: 'লোইশিনখ্রে',
      playSlideshow: 'ফোতো য়েংবা',
      pauseSlideshow: 'লেপ্পা',
    },
    lus: {
      aiCompanionBadge: 'AI Ṭhian',
      aiCompanionDesc: 'Smriti nen titi dun rawh—hriatrengna, nitin hun duan leh titi pui tur i AI ṭhian duhtak a ni.',
      speakWithSmritiBtn: 'Smriti be rawh',
      aiVoiceBadge: 'AI Aw',
      addVoiceReminderBtn: '+ Aw Hriattirna',
      voiceReminderCardTitle: 'Aw Hriattirna',
      voiceReminderCardDesc: 'I aw ngeiin hriattirna sawi la, hun ruat rawh, a hunah a rawn ri chhuak mai ang.',
      recordVoiceReminderBtn: 'Aw Hriattirna Record Rawh',
      snoozedBadge: 'Nghak rih',
      deliveredBadge: 'Tih zawh',
      playSlideshow: 'Thlalak en rawh',
      pauseSlideshow: 'Chawlhtir',
    },
    kha: {
      aiCompanionBadge: 'AI Paralok',
      aiCompanionDesc: 'Kren beit bad ka Smriti—ban kynmaw, ka jingim man la ka sngi bad ka jingïakren kaba sngewtynnat.',
      speakWithSmritiBtn: 'Kren bad ka Smriti',
      aiVoiceBadge: 'AI Ktien',
      addVoiceReminderBtn: '+ Ktien Jingkynmaw',
      voiceReminderCardTitle: 'Jingkynmaw da ka Ktien',
      voiceReminderCardDesc: 'Record ia ka jingkynmaw da ka ktien jong phi, buh por, kan riew hi mar pura ka por.',
      recordVoiceReminderBtn: 'Record Ktien Jingkynmaw',
      snoozedBadge: 'Pynslem',
      deliveredBadge: 'La pyndep',
      playSlideshow: 'Peit dur',
      pauseSlideshow: 'Sangeh',
    },
    grt: {
      aiCompanionBadge: 'AI Rorimiting',
      aiCompanionDesc: 'Smriti baksa golpo ka·bo—gual·jana aro salanti kattani gimin nang·ni ka·sae AI rorimiting.',
      speakWithSmritiBtn: 'Smriti baksa aganbo',
      aiVoiceBadge: 'AI Ku·rang',
      addVoiceReminderBtn: '+ Ku·rang Gual·atani',
      voiceReminderCardTitle: 'Ku·rangchi Gual·atani',
      voiceReminderCardDesc: 'Nang·ni ku·rango gual·ataniko record ka·bo aro somoio bansrang ring·gen.',
      recordVoiceReminderBtn: 'Ku·rang Gual·atani Record Ka·bo',
      snoozedBadge: 'Ru·utbate',
      deliveredBadge: 'Matchotaha',
      playSlideshow: 'Noksa Nibo',
      pauseSlideshow: 'Dondikbo',
    },
    trp: {
      aiCompanionBadge: 'AI Lagui',
      aiCompanionDesc: 'Smriti bai kok saldi—nini uansukma, sal kaham tei kok salna nini hamjakma AI lagui.',
      speakWithSmritiBtn: 'Smriti bai kok saldi',
      aiVoiceBadge: 'AI Kok',
      addVoiceReminderBtn: '+ Khuk bai Kok',
      voiceReminderCardTitle: 'Khuk bai Kok',
      voiceReminderCardDesc: 'Nini khuk bai record khlai, jora chongdi, tei a jorao nini kok khna nai.',
      recordVoiceReminderBtn: 'Khuk bai Kok Record Khlai',
      snoozedBadge: 'Yaphlang',
      deliveredBadge: 'Paijakha',
      playSlideshow: 'Photo Nai',
      pauseSlideshow: 'Don-di',
    },
    nag: {
      aiCompanionBadge: 'AI Sathi',
      aiCompanionDesc: 'Smriti logot sidha kotha koribi—yaad thakibole aru morom pora kotha patibole apuni laga AI sathi.',
      speakWithSmritiBtn: 'Smriti logot Kotha Koribi',
      aiVoiceBadge: 'AI Awaz',
      addVoiceReminderBtn: '+ Voice Reminder',
      voiceReminderCardTitle: 'Voice Reminder',
      voiceReminderCardDesc: 'Nijor awaz te reminder record koribi, time chunibi, aru automatic baji uthibo.',
      recordVoiceReminderBtn: 'Voice Reminder Record Koribi',
      snoozedBadge: 'Snoozed',
      deliveredBadge: 'Delivered',
      playSlideshow: 'Photos Sabo',
      pauseSlideshow: 'Rokhobi',
    },
    ne: {
      aiCompanionBadge: 'AI साथी',
      aiCompanionDesc: 'स्मृतिसँग प्रत्यक्ष कुरा गर्नुहोस्—सम्झन, दैनिक तालिका र रमाइलो कुराकानीका लागि हजुरको मायालु AI साथी।',
      speakWithSmritiBtn: 'स्मृतिसँग कुरा गर्नुहोस्',
      aiVoiceBadge: 'AI आवाज',
      addVoiceReminderBtn: '+ आवाज रिमाइन्डर',
      voiceReminderCardTitle: 'आवाज रिमाइन्डर',
      voiceReminderCardDesc: 'आफ्नै आवाजमा रिमाइन्डर सन्देश रेकर्ड गर्नुहोस्, समय छान्नुहोस् र निर्धारित समयमा यो आफैँ बज्नेछ।',
      recordVoiceReminderBtn: 'आवाज रिमाइन्डर रेकर्ड गर्नुहोस्',
      snoozedBadge: 'पछि सारिएको',
      deliveredBadge: 'सम्पन्न भयो',
      playSlideshow: 'तस्बिरहरू हेर्नुहोस्',
      pauseSlideshow: 'रोक्नुहोस्',
    },
  };

  return dict[lang] || dict.en;
};

// ============================================================================
// 4. CARE CIRCLE LOCALIZATION HELPER
// ============================================================================

export interface CareCircleUiStrings {
  syncedToday: (time?: string) => string;
  rollingBaseline: string;
  monthJul: string;
  monthAug: string;
  thisWeek: string;
  gamesPlayed: (count: number) => string;
  close: string;
  active: string;
  activitiesSummary: string;
  connect: string;
  directVoiceConnection: string;
  calling: (name: string) => string;
  voiceBridgeDesc: string;
  howTrendsWork: string;
  howTrendsDesc: (name: string) => string;
}

export const getCareCircleUiStrings = (lang?: LanguageCode | string): CareCircleUiStrings => {
  const dict: Record<LanguageCode, CareCircleUiStrings> = {
    as: {
      syncedToday: (t?: string) => t ? t : 'আজি ১০:১২ বজাত সংলগ্ন হ’ল',
      rollingBaseline: 'চলমান ১৪-দিনীয়া স্বাভাৱিক মান',
      monthJul: 'জুলাই',
      monthAug: 'আগষ্ট',
      thisWeek: 'এই সপ্তাহ',
      gamesPlayed: (count: number) => `(${count} টা খেল খেলা হ’ল)`,
      close: 'বন্ধ কৰক',
      active: 'সক্ৰিয়',
      activitiesSummary: '৫ টাৰ ভিতৰত ৪ টা কাৰ্য্য · ৬ মিনিট',
      connect: 'সংযোগ কৰক',
      directVoiceConnection: 'পোনপটীয়া কণ্ঠ সংযোগ',
      calling: (name: string) => `${name} লৈ কল কৰা হৈছে`,
      voiceBridgeDesc: 'স্থানীয় নেটৱৰ্ক আৰু ভাষিণী কণ্ঠ সেতুৰে সংযোজিত।',
      howTrendsWork: 'স্মৃতিয়ে কেনেদৰে গতিবিধি লক্ষ্য কৰে:',
      howTrendsDesc: (name: string) => `স্মৃতিয়ে ${name}ৰ সহজ দৈনন্দিন তালৰ ওপৰত ভিত্তি কৰি ১৪ দিনীয়া ব্যক্তিগত স্বাভাৱিক মান নিৰ্ণয় কৰে, যাতে এটা দিনৰ ক্লান্তিৰ পৰিৱৰ্তে দীৰ্ঘম্যাদী অভ্যাস অনুসৰণ কৰিব পাৰি।`,
    },
    brx: {
      syncedToday: (t?: string) => t ? t : 'दिनै १०:१२ रिंगायाव ज’ जाबाय',
      rollingBaseline: 'थांनाय १४-साननि सरासनस्रा मान',
      monthJul: 'जुलाइ',
      monthAug: 'आगस्त',
      thisWeek: 'दानि सप्ताह',
      gamesPlayed: (count: number) => `(${count} गेलेनाय जाबाय)`,
      close: 'बन्द खालाम',
      active: 'मावफुं',
      activitiesSummary: '५ नि गेजेराव ४ मावथाइ · ६ मिनिट',
      connect: 'फोनांजाब',
      directVoiceConnection: 'थिं राव फोनांजाब',
      calling: (name: string) => `${name} नो कल खालामगासिनो`,
      voiceBridgeDesc: 'गामियारि नेटवर्क आरो भाषिणी राव दालां जों फोनांजाबबाय।',
      howTrendsWork: 'स्मृतिआ बोरै नायदिङो:',
      howTrendsDesc: (name: string) => `स्मृतिआ ${name} नि सानफ्रोमबोनि रोखोमखौ लानानैनो १४-साननि सरासनस्रा दिन्थिनाय गोहोम लायो।`,
    },
    mni: {
      syncedToday: (t?: string) => t ? t : 'ঙসি অয়ুক ১০:১২ দা পুনশিনখ্রে',
      rollingBaseline: 'চৎলিবা পুং ১৪ নিগী চাংচৎ',
      monthJul: 'জুলাই',
      monthAug: 'আগস্ট',
      thisWeek: 'চয়োল অসিদা',
      gamesPlayed: (count: number) => `(${count} মশান্না শানখ্রে)`,
      close: 'থিংশিনবা',
      active: 'অ্যাক্টিভ',
      activitiesSummary: '৫ গীদগী ৪ থবক লোইরে · ৬ মিনিট',
      connect: 'শম্নহনবা',
      directVoiceConnection: 'খোঞ্জেলগী হকথেংনবা শম্নবা',
      calling: (name: string) => `${name} দা কোল তৌরি`,
      voiceBridgeDesc: 'মফমগী নেটৱার্ক অমসুং ভাষিনী খোঞ্জেলগী থোংনা শম্নহল্লে।',
      howTrendsWork: 'স্মৃতিনা খোংজেল য়েংশিনবা ফিবম:',
      howTrendsDesc: (name: string) => `স্মৃতিনা ${name} গী নুংঙাইবা তালবু য়ুমফম ওইরগা পুং ১৪ নিগী চাংচৎ লেপথোকই।`,
    },
    lus: {
      syncedToday: (t?: string) => t ? t : 'Vawiin 10:12 AM-a sync tawh',
      rollingBaseline: 'Ni 14 chhung tehna pangngai',
      monthJul: 'JUL',
      monthAug: 'AUG',
      thisWeek: 'KARIN',
      gamesPlayed: (count: number) => `(infiamna ${count} khelh tawh)`,
      close: 'Khar rawh',
      active: 'Nungchang',
      activitiesSummary: 'Tih tur 5 zinga 4 zo · 6 min',
      connect: 'Zawm rawh',
      directVoiceConnection: 'Aw inhriattirna tlang',
      calling: (name: string) => `${name} call mek`,
      voiceBridgeDesc: 'Tualchhung network leh Bhashini aw hmanga zawm a ni.',
      howTrendsWork: 'Smriti-in a zirtir dan:',
      howTrendsDesc: (name: string) => `Smriti hian ${name} awmdan pangngai zuiin ni 14 tehna a siam a ni.`,
    },
    kha: {
      syncedToday: (t?: string) => t ? t : 'La pynbeit mynta 10:12 AM',
      rollingBaseline: 'Ka rukom treikamu 14 sngi',
      monthJul: 'Nai-tul',
      monthAug: 'Nai-phrah',
      thisWeek: 'Kane ka taiew',
      gamesPlayed: (count: number) => `(La ialeh ${count} sien)`,
      close: 'Khang',
      active: 'Treikam',
      activitiesSummary: '4 na ki 5 ki kam · 6 min',
      connect: 'Pyniasoh',
      directVoiceConnection: 'Ka jingiathuh sur kaba beit',
      calling: (name: string) => `Dang phone sha ${name}`,
      voiceBridgeDesc: 'La pyniasoh lyngba ka network bad Bhashini voice.',
      howTrendsWork: 'Kumno ka Smriti ka trei kam:',
      howTrendsDesc: (name: string) => `Ka Smriti ka peit ia ka rukom trei kam jong ${name} ha ki 14 sngi.`,
    },
    hi: {
      syncedToday: (t?: string) => t ? t : 'आज सुबह 10:12 बजे सिंक हुआ',
      rollingBaseline: '14-दिवसीय व्यक्तिगत बेसलाइन',
      monthJul: 'जुलाई',
      monthAug: 'अगस्त',
      thisWeek: 'इस सप्ताह',
      gamesPlayed: (count: number) => `(${count} खेल खेले गए)`,
      close: 'बंद करें',
      active: 'सक्रिय',
      activitiesSummary: '5 में से 4 गतिविधियां पूरी · 6 मिनट',
      connect: 'कॉल करें',
      directVoiceConnection: 'सीधा वॉयस कनेक्शन',
      calling: (name: string) => `${name} को कॉल किया जा रहा है`,
      voiceBridgeDesc: 'स्थानीय सेल्युलर और भाषिणी वॉयस ब्रिज द्वारा जुड़ा हुआ।',
      howTrendsWork: 'स्मृति कैसे रुझान समझता है:',
      howTrendsDesc: (name: string) => `स्मृति ${name} की दैनिक सहज गति के आधार पर 14 दिनों का व्यक्तिगत बेसलाइन तय करता है।`,
    },
    en: {
      syncedToday: (t?: string) => t ? t : 'Synced today at 10:12 AM',
      rollingBaseline: 'Rolling 14-Day Baseline',
      monthJul: 'JUL',
      monthAug: 'AUG',
      thisWeek: 'THIS WEEK',
      gamesPlayed: (count: number) => `(${count} games played)`,
      close: 'Close',
      active: 'Active',
      activitiesSummary: '4 of 5 activities · 6 min',
      connect: 'Connect',
      directVoiceConnection: 'Direct Voice Connection',
      calling: (name: string) => `Calling ${name}`,
      voiceBridgeDesc: 'Connected via local cellular and Bhashini gentle voice bridge.',
      howTrendsWork: 'How Smriti reads trends:',
      howTrendsDesc: (name: string) => `Smriti establishes a 14-day personal baseline calibrated to ${name}'s comfortable rhythm. Daily game scores roll up to detect sustained patterns rather than one tired evening.`,
    },
    grt: {
      syncedToday: (t?: string) => t ? t : 'Da·alo 10:12 AM-o sync ka·aha',
      rollingBaseline: 'Sal 14-ni bewal',
      monthJul: 'JUL',
      monthAug: 'AUG',
      thisWeek: 'Ia antio',
      gamesPlayed: (count: number) => `(Kal·a ${count} matchotaha)`,
      close: 'Chipbo',
      active: 'Kam ka·enga',
      activitiesSummary: 'Kam 5-oni 4 matchotaha · 6 min',
      connect: 'Nangrimbo',
      directVoiceConnection: 'Ku·rangchi gital nangrimani',
      calling: (name: string) => `${name}-na ring·enga`,
      voiceBridgeDesc: 'Network aro Bhashini ku·rangchi nangrimataha.',
      howTrendsWork: 'Smriti maikai nina man·a:',
      howTrendsDesc: (name: string) => `Smriti ${name}-ni bewalko sal 14-ni gisepo nirika.`,
    },
    trp: {
      syncedToday: (t?: string) => t ? t : 'Tini 10:12 AM-o sync khlaikha',
      rollingBaseline: 'Sal 14-ni bisi bisingo',
      monthJul: 'JUL',
      monthAug: 'AUG',
      thisWeek: 'A hapta',
      gamesPlayed: (count: number) => `(Khel ${count} paijakha)`,
      close: 'Tepdi',
      active: 'Khumbar',
      activitiesSummary: 'Samung 5-o 4 paijakha · 6 min',
      connect: 'Romdi',
      directVoiceConnection: 'Kok bai romdi',
      calling: (name: string) => `${name}-no call khlaio`,
      voiceBridgeDesc: 'Network tei Bhashini kok bai romjakha.',
      howTrendsWork: 'Smriti bahaikhe naio:',
      howTrendsDesc: (name: string) => `Smriti ${name}-ni sal 14-ni bisingo samung naio.`,
    },
    nag: {
      syncedToday: (t?: string) => t ? t : 'Aji 10:12 AM te sync hoise',
      rollingBaseline: '14 Din laga baseline',
      monthJul: 'JUL',
      monthAug: 'AUG',
      thisWeek: 'Eitu hafta',
      gamesPlayed: (count: number) => `(${count} khel kheli loise)`,
      close: 'Bondho koribi',
      active: 'Active',
      activitiesSummary: '5 ta pora 4 ta hoise · 6 min',
      connect: 'Connect',
      directVoiceConnection: 'Sidha voice connection',
      calling: (name: string) => `${name} ke call kori ase`,
      voiceBridgeDesc: 'Local cellular aru Bhashini voice bridge logot connect hoise.',
      howTrendsWork: 'Smriti trends kiba buji pai:',
      howTrendsDesc: (name: string) => `Smriti ${name} laga aaram rhythm pora 14 din laga baseline banaise.`,
    },
    ne: {
      syncedToday: (t?: string) => t ? t : 'आज बिहान १०:१२ बजे सिङ्क भयो',
      rollingBaseline: '१४-दिने व्यक्तिगत बेसलाइन',
      monthJul: 'जुलाई',
      monthAug: 'अगस्ट',
      thisWeek: 'यो हप्ता',
      gamesPlayed: (count: number) => `(${count} वटा खेल खेलियो)`,
      close: 'बन्द गर्नुहोस्',
      active: 'सक्रिय',
      activitiesSummary: '५ मध्ये ४ वटा गतिविधि सम्पन्न · ६ मिनेट',
      connect: 'सम्पर्क गर्नुहोस्',
      directVoiceConnection: 'प्रत्यक्ष आवाज सम्पर्क',
      calling: (name: string) => `${name} लाई कल गरिँदैछ`,
      voiceBridgeDesc: 'स्थानीय सेलुलर र भाषिणी भ्वाइस ब्रिजमार्फत जोडिएको छ।',
      howTrendsWork: 'स्मृतिले कसरी प्रवृत्ति पढ्छ:',
      howTrendsDesc: (name: string) => `स्मृतिले ${name}को सहज दैनिक गति अनुसार १४ दिनको व्यक्तिगत बेसलाइन स्थापना गर्दछ।`,
    },
  };

  return (lang && (lang as LanguageCode) in dict) ? dict[lang as LanguageCode] : dict.as;
};
