import { FamilyMember, Reminder, Story, DailyScore, CaregiverAlert, CareCircleMember, CaregiverNote, LanguageOption, DailyAdherenceLog } from '../types';

export const LANGUAGES: LanguageOption[] = [
  {
    code: 'as',
    label: 'Assamese',
    nativeLabel: 'অসমীয়া',
    greeting: 'নমস্কাৰ, আইতা',
    listenButtonText: '▶ শুনক অসমীয়াত',
  },
  {
    code: 'brx',
    label: 'Bodo',
    nativeLabel: 'बर’',
    greeting: 'खुलुमबाय, आइता',
    listenButtonText: '▶ बर’ रावआव खोनासं',
  },
  {
    code: 'mni',
    label: 'Manipuri / Meitei',
    nativeLabel: 'মৈতৈলোন্',
    greeting: 'খুরুমজরি, ইবেম্মা',
    listenButtonText: '▶ মৈতৈলোন্দা তারসি',
  },
  {
    code: 'lus',
    label: 'Mizo',
    nativeLabel: 'Mizo ṭawng',
    greeting: 'Chibai, Ka Pi',
    listenButtonText: '▶ Mizo ṭawngin ngaithla',
  },
  {
    code: 'kha',
    label: 'Khasi',
    nativeLabel: 'Ka Ktien Khasi',
    greeting: 'Khublei, I Mei',
    listenButtonText: '▶ Sngap ha ka Khasi',
  },
  {
    code: 'grt',
    label: 'Garo',
    nativeLabel: 'A·chik',
    greeting: 'Mitingalo, Ambik',
    listenButtonText: '▶ A·chik ku·sikchi knabo',
  },
  {
    code: 'trp',
    label: 'Kokborok',
    nativeLabel: 'Kokborok',
    greeting: 'Khulumkha, Achu',
    listenButtonText: '▶ Kokborok bai khnadik',
  },
  {
    code: 'nag',
    label: 'Nagamese',
    nativeLabel: 'Nagamese',
    greeting: 'Namaste, Aita',
    listenButtonText: '▶ Nagamese te sunibi',
  },
  {
    code: 'ne',
    label: 'Nepali',
    nativeLabel: 'नेपाली',
    greeting: 'नमस्ते, हजुरआमा',
    listenButtonText: '▶ नेपालीमा सुन्नुहोस्',
  },
  {
    code: 'hi',
    label: 'Hindi',
    nativeLabel: 'हिन्दी',
    greeting: 'नमस्ते, दादी जी',
    listenButtonText: '▶ हिन्दी में सुनें',
  },
  {
    code: 'en',
    label: 'English',
    nativeLabel: 'English',
    greeting: 'Namaskar, Aita',
    listenButtonText: '▶ Listen in English',
  },
];

export const INITIAL_FAMILY_MEMBERS: FamilyMember[] = [
  {
    id: 'fam-1',
    name: 'Sunita',
    relationship: 'Bor-Bhow (Eldest Daughter-in-law)',
    photoUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=800&q=80',
    voiceNoteText: 'Aita, I will bring warm ginger tea after your morning walk! Drink your water on time.',
    hint: 'She brings you warm ginger tea every morning and wears yellow sarees.',
    extendedFamily: false,
    addedBy: 'caregiver',
    addedAt: '2026-08-10',
  },
  {
    id: 'fam-2',
    name: 'Arjun',
    relationship: 'Nati (Grandson)',
    photoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=800&q=80',
    voiceNoteText: 'Aita! I won the college design competition in Guwahati today! Calling you this evening.',
    hint: 'Your grandson who wears glasses and is studying architecture in Guwahati.',
    extendedFamily: false,
    addedBy: 'caregiver',
    addedAt: '2026-08-12',
  },
  {
    id: 'fam-3',
    name: 'Biren',
    relationship: 'Loralu (Younger Son)',
    photoUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=800&q=80',
    voiceNoteText: 'Maa, thinking of you from Pune. The mango pickle you sent is delicious.',
    hint: 'Your younger son living in Pune who calls every Sunday at 10 AM.',
    extendedFamily: false,
    addedBy: 'caregiver',
    addedAt: '2026-08-15',
  },
  {
    id: 'fam-4',
    name: 'Natasha',
    relationship: 'Natini (Granddaughter)',
    photoUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=800&q=80',
    voiceNoteText: 'Aita, look at the painting we made together last summer. Sending love!',
    hint: 'Your sweet granddaughter who loves drawing water lilies with you.',
    extendedFamily: false,
    addedBy: 'caregiver',
    addedAt: '2026-08-20',
  },
  {
    id: 'fam-5',
    name: 'Pranab Uncle',
    relationship: 'Kokaideu (Elder Brother)',
    photoUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=800&q=80',
    voiceNoteText: 'Sister, planting the winter marigolds in Jorhat garden today.',
    hint: 'Your elder brother in Jorhat who loves gardening and tea.',
    extendedFamily: true,
    addedBy: 'caregiver',
    addedAt: '2026-08-25',
  },
];

export const INITIAL_REMINDERS: Reminder[] = [
  {
    id: 'rem-1',
    title: 'Medicine reminder',
    category: 'medicine',
    subtitle: 'BP tablet · 9:30 AM',
    time: '9:30 AM',
    completed: false,
    recurrence: 'Daily',
    createdBy: 'caregiver',
  },
  {
    id: 'rem-2',
    title: 'Warm hydration',
    category: 'hydration',
    subtitle: 'Glass of warm lemon water · 11:30 AM',
    time: '11:30 AM',
    completed: true,
    completedAt: '2026-09-14T11:38:00.000Z',
    completionStatus: 'on_time',
    responseDelayMinutes: 8,
    recurrence: 'Daily',
    createdBy: 'caregiver',
  },
  {
    id: 'rem-3',
    title: 'Evening walk',
    category: 'activity',
    subtitle: 'Gentle garden stroll with Sunita · 5:00 PM',
    time: '5:00 PM',
    completed: false,
    recurrence: 'Daily',
    createdBy: 'patient',
  },
  {
    id: 'rem-4',
    title: 'Night eye drops',
    category: 'medicine',
    subtitle: 'Lubricant drops after dinner · 8:45 PM',
    time: '8:45 PM',
    completed: false,
    recurrence: 'Daily',
    createdBy: 'caregiver',
  },
];

export const INITIAL_ADHERENCE_HISTORY: DailyAdherenceLog[] = [
  {
    date: '2026-09-08',
    displayDate: 'Sep 8',
    dayOfWeek: 'Tue',
    totalScheduled: 4,
    completedCount: 4,
    onTimeCount: 4,
    lateCount: 0,
    missedCount: 0,
    completionRate: 100,
    timelinessRate: 100,
    isNearFullAdherence: true,
  },
  {
    date: '2026-09-09',
    displayDate: 'Sep 9',
    dayOfWeek: 'Wed',
    totalScheduled: 4,
    completedCount: 4,
    onTimeCount: 3,
    lateCount: 1,
    missedCount: 0,
    completionRate: 100,
    timelinessRate: 75,
    isNearFullAdherence: true,
  },
  {
    date: '2026-09-10',
    displayDate: 'Sep 10',
    dayOfWeek: 'Thu',
    totalScheduled: 4,
    completedCount: 4,
    onTimeCount: 4,
    lateCount: 0,
    missedCount: 0,
    completionRate: 100,
    timelinessRate: 100,
    isNearFullAdherence: true,
  },
  {
    date: '2026-09-11',
    displayDate: 'Sep 11',
    dayOfWeek: 'Fri',
    totalScheduled: 4,
    completedCount: 3,
    onTimeCount: 3,
    lateCount: 0,
    missedCount: 1,
    completionRate: 75,
    timelinessRate: 100,
    isNearFullAdherence: false,
  },
  {
    date: '2026-09-12',
    displayDate: 'Sep 12',
    dayOfWeek: 'Sat',
    totalScheduled: 4,
    completedCount: 4,
    onTimeCount: 4,
    lateCount: 0,
    missedCount: 0,
    completionRate: 100,
    timelinessRate: 100,
    isNearFullAdherence: true,
  },
  {
    date: '2026-09-13',
    displayDate: 'Sep 13',
    dayOfWeek: 'Sun',
    totalScheduled: 4,
    completedCount: 4,
    onTimeCount: 4,
    lateCount: 0,
    missedCount: 0,
    completionRate: 100,
    timelinessRate: 100,
    isNearFullAdherence: true,
  },
];

export const INITIAL_DAILY_SCORES: DailyScore[] = [
  { date: '2026-07-05', displayDate: 'JUL', averageScore: 61, sessionsCount: 3, baselineDiff: -11 },
  { date: '2026-07-15', displayDate: 'JUL 15', averageScore: 68, sessionsCount: 4, baselineDiff: -4 },
  { date: '2026-07-28', displayDate: 'JUL 28', averageScore: 71, sessionsCount: 3, baselineDiff: -1 },
  { date: '2026-08-05', displayDate: 'AUG', averageScore: 74, sessionsCount: 4, baselineDiff: 2 },
  { date: '2026-08-18', displayDate: 'AUG 18', averageScore: 68, sessionsCount: 3, baselineDiff: -4 },
  { date: '2026-08-25', displayDate: 'AUG 25', averageScore: 69, sessionsCount: 4, baselineDiff: -3 },
  { date: '2026-09-01', displayDate: 'SEP 1', averageScore: 65, sessionsCount: 3, baselineDiff: -7 },
  { date: '2026-09-02', displayDate: 'SEP 2', averageScore: 62, sessionsCount: 2, baselineDiff: -10 },
  { date: '2026-09-03', displayDate: 'SEP 3', averageScore: 54, sessionsCount: 2, baselineDiff: -18 },
  { date: '2026-09-04', displayDate: 'THIS WEEK', averageScore: 53, sessionsCount: 2, baselineDiff: -19 },
];

export const INITIAL_ALERTS: CaregiverAlert[] = [
  {
    id: 'alert-1',
    tier: 'gentle',
    title: 'Gentle check-in suggested',
    description: "Aita's routine changed a little this week. Responses on pattern games took 15% longer, and yesterday's evening walk was skipped.",
    date: 'Today, 8:30 AM',
    acknowledged: false,
    suggestedAction: 'Ask Aita gently about sleep quality or check if her spectacles need cleaning.',
  },
];

export const INITIAL_CARE_CIRCLE: CareCircleMember[] = [
  {
    id: 'cc-1',
    name: 'Priya Barua',
    relationship: 'Daughter (Guwahati)',
    role: 'Primary Caregiver',
    phone: '+91 98640 12345',
    lastActive: '10 mins ago',
  },
  {
    id: 'cc-2',
    name: 'Biren Barua',
    relationship: 'Son (Pune)',
    role: 'Family',
    phone: '+91 98220 54321',
    lastActive: 'Today at 8:15 AM',
  },
  {
    id: 'cc-3',
    name: 'Dr. N. K. Sarma',
    relationship: 'Family Physician',
    role: 'Physician',
    phone: '+91 94350 99887',
    lastActive: 'Yesterday',
  },
  {
    id: 'cc-4',
    name: 'Rumi Das',
    relationship: 'ASHA Health Worker',
    role: 'ASHA Worker',
    phone: '+91 97060 44556',
    lastActive: 'Synced today at 10:12 AM',
  },
];

export const INITIAL_CARE_NOTES: CaregiverNote[] = [
  {
    id: 'note-1',
    fromName: 'Priya',
    relation: 'Daughter',
    message: 'Ma, had a lovely conversation with you yesterday. Remember to enjoy the garden sun today!',
    timestamp: 'Yesterday at 7:30 PM',
  },
  {
    id: 'note-2',
    fromName: 'Arjun',
    relation: 'Grandson',
    message: 'Aita, I am bringing fresh coconut sweets when I visit this weekend!',
    timestamp: 'Today at 9:00 AM',
  },
];

export const STORIES_DATA: Story[] = [
  {
    id: 'story-whispers-burhi-aai',
    title: 'Whispers of the Burhi Aai',
    category: 'Historical Fiction / Folk-History',
    regionState: 'Assam',
    district: 'Kamrup / Saraighat',
    language: 'as',
    durationMinutes: 7,
    coverImage: 'https://images.unsplash.com/photo-1544644181-1484b3fdfc62?auto=format&fit=crop&w=1200&q=80',
    tags: ['Saraighat', 'Brahmaputra', 'Lachit Borphukan', 'Muga Silk', 'Burhi Aai'],
    synopsis: 'On the misty banks of the Bor Luit, an old royal boatwright and his granddaughter prepare a sacred bachari-nao for the battle of Saraighat, guided by the ancestral spirit of the river.',
    fullScript: `The mist never truly left the chest of the Bor Luit. Even when the morning sun climbed over the jagged rim of the Patkai hills, painting the river in shades of molten brass, the great Brahmaputra exhaled a cool, milky vapor that clung to the elephant grass and the dark, glistening bellies of the river craft.

From the open bamboo veranda of his chang-ghar, raised high above the silt on stout sal-wood stilts, Bhabadhar Bora listened to the river breathe. To the uninitiated, it was merely the rushing of brown water over sandbars, but Bhabadhar had rowed beneath the shadow of royal drums for thirty years. He knew the water was singing an old tune—one that tasted of melted Himalayan snow, churned mud, and the iron of dried blood.

Below him in the courtyard, the sharp, rhythmic clack-thump of the tat-xal had already begun.

His granddaughter, Junaki, sat cross-legged before the wooden loom, her slender fingers guiding the bamboo shuttle through a sea of white muga silk. She was barely fourteen, yet the blood-red kingkhap motifs blooming under her touch carried the steady precision of an artisan twice her years. At the border of the cloth, she was weaving the sacred sprigs of the biyoni, traditional borders fit for an offering.

"You strike the treadle too fiercely, Moinu," Bhabadhar called out, leaning over the peeled bamboo railing. His voice was like dried betel husks scraping against a whetstone. "The thread of the muga is tough, but it holds memory. It will stiffen if you give it anger instead of patience."

Junaki did not stop her rhythm, though the corners of her mouth twitched. "It is not anger, Koka," she answered, tossing the shuttle through the warp with a soft flick of her wrist. "It is haste. The royal runners passed through the lower landing before cockcrow. They say the Bongal fleet—Raja Ram Singh’s great war-boats—have anchored past the bend of Kaliabor. The Borphukan has summoned every able oar from here to Guwahati. If the men are to march, they cannot carry empty hands. A warrior without a gamusa around his neck goes into the water with a cold heart."

Bhabadhar went down the notched log ladder, his scarred knee clicking with every step—a reminder of a Mughal musket ball taken at Samdhara a decade ago. He crossed the yard, where the unmistakable sweetness of autumn joha rice drifted from the boiling pot of his late wife’s brass stove.

On a brass xorai resting upon a clean reed mat, Junaki had set out fresh tamul-paan. The freshly sliced areca nut was moist, the betel leaf dark and peppery, smeared with just a thumb’s breath of slaked lime. Bhabadhar picked up a leaf, folded it with practiced ease, and tucked it into his cheek. The warm, earthy bite grounded him.

"Lachit Borphukan will not lose the throat of Assam," Bhabadhar said softly, his gaze drifting past the drying reeds to where his workshop met the riverbank. "The son of Momai Tamuli does not know how to bend. But water is an unfaithful companion, Junaki. It belongs neither to the Ahom nor to the Rajput. It answers only to the one who knows its belly."

He turned toward the shed of thatched toka leaves where his life's quiet labor lay. There, resting upon wooden cradles, was a half-finished bachari-nao—a war canoe carved from the trunk of a colossal hollong tree. Its spine was forty paces long, narrow and wickedly curved, shaped to skim the turbulent shoals of Saraighat like a water-beetle.

Junaki stepped away from her loom, wiping her brow with the edge of her riha. She followed her grandfather into the shade of the timber shed, her eyes tracing the deep gouges left by the curved adze.

"Is it true what the elders say by the river ghat?" she asked, lowering her voice as if the brown current might overhear. "That the Luit will only yield to the Burhi Aai’s blessing when the sky turns violet? That the old grandmother of the river demands a soul before she opens the deep channels to Saraighat?"

Bhabadhar ran a palm, rough as river sand, over the smooth gunwale of the vessel. He smiled, the creases around his eyes deepening like the fissures in parched monsoon soil.

"Old women’s tales, Moinu, told to keep foolish boys from swimming into the whirlpools when the monsoon swells," he said, though his hand remained motionless on the timber. "Yet... not entirely untrue. The river does not want blood; the river wants humility. The Bongal generals build their great, heavy pinnaces with iron nails and foreign oak. They think they can conquer the current by weight and thunder. But our ancestors learned from the Burhi Aai: a boat must not fight the wave. It must yield like the supple river-cane, bending with the undertow until the current itself flings you forward."

He picked up his adze, striking the inner rib with light, rhythmic taps that rang through the morning air.

"When we held the water at the mouth of the Dikhow during my first khel service," Bhabadhar continued, his voice dropping into the quiet cadence of memory, "the mist was so thick you could not see the blade of your own oar. My father was the chief helmsman. He did not watch the stars, for there were none. He smelled the water. He said, 'Bhabadhar, when the water smells of crushed sweet-flag, you are over the shallows. When it smells of wet stone, row for your life, for the sandbank will break your keel.' That knowledge is our fortress. Saraighat is not merely rock and earth; it is the narrow gate through which no arrogance can pass."

The midday sun stood directly above their heads when the brass gong sounded from the river watchtower.

Three short, resonant strokes, followed by the steady beat of a flat war drum.

Down at the village ghat, past the fluttering bamboo groves, the Paik levies were gathering. Young men—farmers who had only yesterday been weeding the ripening bao paddies, boatwrights, fishermen—stood in disciplined ranks. They wore little armor, only their tight-woven loincloths, short coats of dyed cotton, and the red-and-white gamusas tied securely across their chests or bound tightly around their foreheads. Their long-handled daos gleamed in the sun.

A young man, his shoulders still lean and uncalloused by war, broke away from the muster and sprinted toward Bhabadhar’s chang-ghar. It was Konbap, the son of the village blacksmith, his eyes wide with the nervous fire of a boy going to his first campaign.

"Bhabadhar Bora!" he panted, touching his forehead with folded hands. "The fleet from Kaliabor has reached the narrows. The commander requests every spare hull that can carry twenty oars. The Rajput prince has brought hundreds of guns, Bora-kai. The hills of Kamakhya are shaking with their powder."

Bhabadhar did not hurry. He laid his adze down upon a bed of wood shavings, picked up a clean rag, and wiped the sweat from his neck.

"The hills of Kamakhya have stood through ten thousand floods, Konbap," the old man said calmly. "A few foreign guns will not blow them into the Brahmaputra."

He stepped toward his unfinished boat, then turned to his granddaughter.

Junaki was already moving. From the loom, she cut the finished cloth—not with haste, but with the solemn, deliberate stroke of an iron blade. She walked to the riverbank and dipped the woven edge into the holy current of the Luit, whispering the ancient verse her grandmother had taught her to keep the river-spirits calm.

She brought the damp cloth to Konbap, draping it around his neck. The crimson flowers of the gamusa seemed to burn against his skin.

"Do not look back at the fields, brother," she said softly, her voice steady and dignified. "The paddy will wait for the harvest. The kingdom must not fall."

Bhabadhar took a length of red cotton cord, knotted with dried root of sweet-grass, and tied it firmly around the bowsprit of the bachari-nao. It was the Paik’s ancient token of offering to the river, a silent pact made between wood, water, and the ancestors who slept beneath the reeds.

"Help me put her to the water," Bhabadhar commanded, his voice suddenly shedding forty years of age, carrying the hard, sharp ring of a royal oarsman.

Konbap, along with four other youths running up from the path, set their shoulders beneath the hull of the vessel. The timber groaned, protesting the dry earth, then slid forward over logs slicked with river mud. With a soft, triumphant sigh, the long, dark boat took the water.

She did not rock. She sat low and poised, cutting the brown swell like the snout of a hunting dolphin.

Bhabadhar took up an oar—his old oar of blackened teak, notched with tally-marks from forgotten skirmishes—and placed it into the rear oarlock. He did not climb aboard. Instead, he placed the handle into Konbap’s shaking hands.

"Take the middle current past the Pandu rock," Bhabadhar told him, his gaze piercing the boy’s uncertainty. "Keep your ears open for the whistle of the Borphukan’s signal arrows. Do not fear the noise of their cannons; smoke blinds the foreigner, but the fog belongs to us. When the wind comes down from the hills, row as if the Burhi Aai herself were pushing your stern."

The boys took their places on the thwarts, digging their blades into the brown foam. As the boat turned into the sweep of the Brahmaputra, heading west toward the great gateway of Saraighat where history was being hammered into legend, Konbap looked back.

Standing on the muddy bank, his feet anchored in the soil of his forefathers, was the old veteran. Beside him, Junaki stood tall, the shuttle already resting against her hip, her hair catching the river breeze. There were no tears, no lamentations. Behind them, the green fields of Assam whispered under the afternoon light, patient and enduring, kept alive not just by the steel of royal commanders, but by the quiet, unyielding thread woven on a village loom.`,
  },
  {
    id: 'story-silt-krem-umbawa',
    title: 'The Silt of Krem Umbawa',
    category: 'Atmospheric Mystery / Thriller',
    regionState: 'Meghalaya',
    district: 'East Khasi Hills / Sohra',
    language: 'kha',
    durationMinutes: 8,
    coverImage: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1200&q=80',
    tags: ['Krem Umbawa', 'U Thlen', 'East Khasi Hills', 'Sohra', 'Living Root Bridge', 'Sacred Grove'],
    synopsis: 'Amidst torrential rain in the East Khasi Hills, an elder headman and a young ranger journey past sacred groves and living root bridges into a subterranean karst cavern to confront an ancient appetite.',
    fullScript: `The rain in the East Khasi Hills did not fall in drops; it descended in vast, sweeping sheets of grey slate, drowning the plateau until the boundaries between rock, tree, and cloud dissolved into a single, breathing vapor.

Bah Ksan stepped beneath the dripping eaves of the community hall, unfastening his knup—the woven bamboo-and-reed rain shield that smelled richly of smoked thatch. He shook the runnels of water from the woven cane and hung it upon the notched wall. Beneath his coarse woolen jacket, he wore a waistcoat of spun ryndia silk, dyed with walnut rind, damp at the seams from three hours of pacing the forest fringes.

Beside him, kneeling near the hearth where dried pine cones sputtered into flame, Dapbiang checked the seals on her canvas haversack. She was barely twenty-five, the youngest forest ranger assigned to the Sohra division, and a daughter of the Mawphlang clan. Despite her brass departmental badge and stiff-soled boots, her eyes carried the wary vigilance of one raised on hearth-side warnings: Never take a single leaf from the Lawkyntang. Do not whistle beneath the monoliths.

"The tea is hot, Bah," she said, handing him an enamel mug that steamed with bitter black tea, dark as bog-water. "Kong Sil has sent word from the lower ridge. Dr. Vance’s room at the homestay is untouched. His spectacles are still resting on his field notebook. His boots are gone."

Bah Ksan took the mug between two calloused palms, his jaw set. As the Rangbah Shnong—the elected headman of the village council—he bore the weight of forty hearths upon his shoulders. He pulled a silver tin from his pocket, cracked open a fresh areca nut, smeared a dab of white lime onto a glossy betel leaf, and offered half to Dapbiang.

"Khublei shibun," she murmured, accepting the kwai. The peppery warmth of the leaf bloomed on their tongues, a sharp, crimson antidote to the relentless damp.

"Dr. Vance had no respect for boundaries," Bah Ksan murmured, his voice low enough not to carry beyond the hearth. "When he arrived from the mainland, he spoke only of rare bryophytes and cavern orchids. But three nights ago, he stood before the Dorbar Shnong and asked if our ancestors used limestone sinkholes for blood offerings. I told him our ancestral stones honor the mothers, not murder. He only smiled that dry, paper smile of his."

"The villagers are already whispering, Bah," Dapbiang said quietly, looking toward the window where the mist coiled like white smoke against the glass. "They say an outsider was heard singing near the Mawrie gorge before the midnight gale. Not singing in Khasi, but chanting. And this morning... someone found a dead fowl at the entrance of Krem Umbawa, its neck broken without an iron cut."

Bah Ksan’s fingers tightened on the enamel mug.

U Thlen.

The name was rarely spoken aloud above a whisper. To utter it was to invite the shadow into one’s granary, into the corners of one’s home where the Mei—the mother—kept the hearth fires alive. It was the ancient serpent that ate human breath, fed by the greed of those who bartered human vitality for gold. Modern men in the capital laughed at the superstition, calling it a fable to explain the avarice of feudal landlords. But here, where limestone veins hollowed the earth beneath their feet, old spirits had a way of surviving in the dark.

"Get your torch, Dap," Bah Ksan said, rising. "We go before the dusk swallows the gorges."

They left the settlement behind, descending the slippery stone steps carved into the sheer hillside. Below them lay the valley of Tyrna, swallowed by the roaring undercurrent of the swollen river. The path narrowed, leading into the ancient canopy of the sacred grove.

Here, within the Lawkyntang, the sound of the rain shifted. The open drum of water on rock became a muffled, rhythmic patter through hundreds of layers of ancient moss, twisting ficus branches, and wild orchids that hung like bleached bones from the boughs. The air smelled of primordial mulch and wet flint. Every fallen branch remained precisely where the wind had thrown it; not a child in the village would dare lift a twig for kindling, lest the guardian spirits demand a payment in blood.

"Look," Dapbiang whispered, shining her flashlight beam along the trail.

At the crossing of the rushing mountain stream, the living root bridge stretched across the chasm. For three centuries, generations of Khasi mothers and fathers had guided the aerial roots of the Ficus elastica through hollow betel-nut trunks, twining them across the void until the wood turned to living iron. Today, the roots were slick as wet snakes.

Midway across the bridge, caught in the tangle of secondary anchor-roots just above the boiling white water, was a yellow waterproof notebook.

Dapbiang moved forward, testing her weight on the braided roots. She retrieved the notebook and opened it beneath the beam of her torch. The pages were waxed, water-resistant, filled with erratic pencil strokes and hand-drawn maps.

"He wasn't collecting orchids," Dapbiang breathed, turning the page. "These are subterranean survey sketches of Krem Umbawa. He charted the passages running straight beneath the village."

Bah Ksan leaned over her shoulder. On the final page, scrawled with trembling, heavy graphite, were three words: IT CALLS HUNGER.

A sharp gust tore through the canopy above, shaking cold water down upon their necks. Deep within the valley, an unnatural vibration resonated through the rock—not the crack of thunder, but the deep, hollow hum of displaced air traveling through an underground labyrinth.

"He went inside the cavern," Bah Ksan said grimly. "The entrance is a sacred place of the clan’s Khadduh. No stranger enters without an elder's permission."

They pushed past the root bridge, scrambling up the western ridge where the limestone karst was punctured by dark fissures. Krem Umbawa opened like an eyeless socket in the wet cliffside, half-hidden behind thick curtains of climbing ferns. The air issuing from its mouth was unnaturally warm, smelling of subterranean sulphur and stale dampness.

At the threshold lay a broken specimen jar, its glass ground into the mud, and beside it, Vance’s high-powered battery lamp, blinking weakly with dying phosphor.

"Doctor Vance?" Dapbiang called out, her voice swallowed instantly by the cavern’s vast interior.

Only the drip of mineral water answered, slow and deliberate: plink... plink... plink.

"Stay on the limestone shelves," Bah Ksan instructed, unhooking his heavy iron lantern and striking a match. The yellow flame cast long, wavering shadows that danced like gaunt men along the scalloped cavern walls. "Do not step into the sandbars. The belly of the cave is treacherous, and the water rises from below without warning."

They moved fifty meters into the cool interior. Stalactites hung like inverted teeth from the vaulted ceiling. As they progressed deeper, the ambient hiss of the outside rain vanished, replaced by an unsettling, absolute silence.

Then, Dapbiang stopped. Her light caught something gleaming against the pale limestone floor.

Scattered across a natural stone slab were dozens of old, tarnished coins—silver rupees from the British Raj, ancient cowrie shells, and small strips of hand-spun raw silk. It was not a botanist’s workspace; it was a shrine.

In the center of the slab sat Dr. Vance.

He was sitting cross-legged, facing the deep black fissure where the cavern dropped into an unmapped subterranean pool. His coat was stripped off, revealing his rain-soaked shirt. He was not moving.

"Doctor Vance?" Bah Ksan stepped forward, raising the lantern high.

The botanist turned his head. His skin was pale, smeared with white lime-clay, his eyes wide and vacant, staring past them into the shadows. In his hands, he clutched a heavy geologist’s hammer, its pick end stained with dark mineral mud.

"You shouldn't have brought the iron down here," Vance whispered. His voice was cracked, paper-thin, vibrating with a strange, nervous exhilaration. "The air... it hums. Can't you hear it? It breathes when the rain falls outside. It’s not an animal. It’s an appetite."

"Put the hammer down, Bah," Dapbiang said steadily, keeping her voice low, slipping into the calm, rhythmic tone an aunt uses to soothe a fevered child. "The Dorbar is waiting. Your people are looking for you."

"They don't understand the geography of this place," Vance muttered, his fingers twitching violently against the tool's rubber handle. "The old Khasi legends... they weren't metaphors. There is an opening down there. The wind pulls down so hard it sounds like a tongue lapping at water. I saw gold... in the silt. It wanted a price. Just a drop of blood on the stone to turn the silt."

He pointed his trembling hammer toward the darkness of the lower pool.

Bah Ksan stepped between the man and the abyss. His posture was no longer that of an aging village elder; it was that of a man guarding the doorway of his ancestral house.

"The earth does not trade with thieves, Vance," Bah Ksan said, his voice dropping into the resonant timber of Khasi authority. "What our ancestors buried in the deep stones was never meant to be weighed on scales. The Thlen is not a creature with scales you can catch in a net; it is the rot in a man's heart when he believes he can take without giving back to the soil."

The elder reached into his pocket and brought out three dried betel leaves. Without hesitation, he tossed them into the dark pool below. They floated on the obsidian surface, turning slowly in the unseen current.

"Leave the metal," Bah Ksan commanded softly. "Stand up, turn your back to the hole, and walk toward the light. If you look back into the pit, the stone will keep your shadow, and no medicine in your world or mine will ever bring your mind out of this cave."

For three excruciating seconds, the only sound was the breathing of the earth—a low, rhythmic suction of air through the limestone chambers that felt like a pulse beneath their boots. Vance’s chest rose and fell rapidly, his eyes darting between the dark pool and the steady, unflinching gaze of the old headman.

Slowly, his fingers lost their grip. The iron hammer fell onto the stone with a dull, hollow clatter that echoed through the dark corridors.

Vance slumped forward, weeping quietly into his mud-stained palms, shivering violently as the fever of the deep caves finally broke.

Dapbiang moved in swiftly, pulling the shivering man up by his arms, wrapping a dry woolen shawl around his shoulders. "We are going home," she said firmly.

Bah Ksan did not move until they had reached the cavern mouth. He turned once, looking back at the black slit of Krem Umbawa. The water had carried the betel leaves out of sight, down into the belly of the hills where the rain filtered into silence.

As they stepped out of the cave, the torrential downpour hit them once more, cold, clean, and indifferent, washing the cavern clay from their boots and rushing down toward the living bridges of the valley below.`,
  },
  {
    id: 'story-interlocking-hearth',
    title: 'The Interlocking Hearth',
    category: 'Heartwarming & Emotional',
    regionState: 'Mizoram',
    district: 'Reiek / Aizawl',
    language: 'lus',
    durationMinutes: 8,
    coverImage: 'https://images.unsplash.com/photo-1511497584788-87676104235f?auto=format&fit=crop&w=1200&q=80',
    tags: ['Mizoram', 'Reiek', 'Tlawmngaihna', 'Chapchar Kut', 'Cheraw', 'Bamboo Craft'],
    synopsis: 'In the mist-covered hills of Reiek, an aging Mizo master basketmaker guides his broken-hearted grandson through the healing art of rawnal bamboo weaving and the ancient spirit of Tlawmngaihna.',
    fullScript: `The morning mist over the hills of Reiek did not lift all at once; it rolled softly down the terraced slopes like unspun silk, resting in the deep green troughs where the wild rawnal bamboo grew tall.

From the tin-roofed church at the crest of the ridge, the four-part harmony of an old autumn hymn drifted across the valley. It was a slow, majestic cadence that seemed to rise from the very soil, mingling with the white woodsmoke that curled upward from kitchen hearths. Down on his low wooden stool beside the open veranda, Ka Pu Laldina listened to the soprano notes climb into the cool air, his weathered hands never pausing in their quiet rhythm.

Between his thumbs, a ribbon of cured cane hissed softly as he pared away the outer husk.

His fingertips were crisscrossed with a lifetime of tiny scars—each one a fine, silvery seam where sharp bamboo had drawn blood over seventy years. Around him lay the fruits of his solitude: sturdy, hourglass-shaped thangnang baskets meant for carrying firewood up sheer inclines, wide-mouthed paikawng for the maize harvest, and winnowing trays so tight they could hold dry river sand without leaking a grain.

Yet, for months now, an ache heavier than his stiffening joints had weighed upon the old man’s chest. The village was changing. The young boys took motorbikes down to Aizawl, chasing computer certificates and call-center desks, returning only for funerals with city dust on their sneakers and eyes that stared through the hills.

"Who will strip the bamboo when I sleep beneath the pine roots?" Ka Pu murmured to the empty veranda. His beloved Ka Pi had passed three winters ago, and the house held too much quiet in the late afternoons. "A basket woven by iron machines has no pulse. It cannot carry a man’s pride."

A floorboard groaned near the threshold.

A young man stood there, clutching an unzipped canvas rucksack against his ribs like a shield. His hair was cut in the uneven, modern fashion of the plains, but his shoulders were curled inward, hollowed out by defeat.

It was Rina, the grandson of Pu Laldina’s late cousin. Two years earlier, the village had pooled money through the local welfare council to send him to Shillong for his engineering diploma. Now, his cheeks were gaunt, his collar frayed, and his gaze fixed firmly on the woven reed matting beneath his mud-splattered shoes.

"Ka Pu," Rina whispered, his voice trembling like a dry leaf caught in a draft.

The old man did not ask why he had returned weeks before the university term ended, nor why the boy smelled of cheap tobacco, damp bus seats, and raw shame. In the hills of Mizoram, true dignity did not interrogate an empty heart at the doorstep.

"The kettle is still singing on the hearth, my boy," Ka Pu said gently, using his horn-handled dao to point toward the kitchen. "Go and pour two bowls of hot coriander tea. There is smoked pork fat hung over the charcoal—slice a thick piece and lay it over the cold rice from yesterday."

Rina swallowed hard, his throat knotting, but he nodded and stepped into the dim, familiar warmth of the kitchen.

Over the days that followed, Rina spoke little. He slept late, waking only when the sun had already burned the valley fog into a diamond haze. He would sit on the edge of the wooden platform, staring out toward the blue ridges of the Blue Mountain in the far distance, lost in the silent wreckage of failed examinations, broken city promises, and the unbearable guilt of having disappointed the villagers who had believed in him.

Ka Pu never pressed him. Instead, on the fourth morning, when the church bells had barely struck six, the old man tossed a pair of thick canvas work-gloves onto the boy’s quilt.

"Get up, Rina," Ka Pu grunted, buckling his woven bamboo sheath to his hip. "The Chapchar Kut festival comes with the clearing of the jhum fields. The Val Upa—the elder council—has asked for eight new harvest baskets and fifty pairs of ceremonial bamboo staves for the Cheraw dancers. An old man’s back cannot haul green timber from the low creek alone."

Reluctantly, moving with the sluggishness of a wounded animal, the youth pulled on his boots and followed.

Deep in the damp shadows of the bamboo ravine, the air smelled of wet earth and crushed river mint. Here, Ka Pu transformed. The stoop in his spine seemed to vanish as he examined the grove with an expert eye.

"Never cut the outer stalks," Ka Pu instructed, resting his flat palm against a towering, jade-green culm. "The outer ring protects the shoot from the monsoon gale. Take only the three-year-old stalks from the heart—the ones whose skin is dusted with pale powder, like the frost on a plum. They have drunk three seasons of rain; their fiber knows how to bend without snapping."

With clean, single strokes of his curved knife, the old man felled the tall stalks. When it came time to carry the heavy bundle back up the steep hillside, Rina reached for the lighter ends, his city-softened hands slick with sweat.

Halfway up the rocky incline, the boy’s foot slipped on wet moss. The heavy bundle of green bamboo crashed down, grazing his forearm and tumbling into a briar patch.

Rina dropped to his knees in the red dirt. He did not curse. Instead, hot, bitter tears suddenly spilled over his eyelashes, cutting pale tracks through the soot on his cheeks.

"I cannot do it, Ka Pu," he wept, his voice breaking into jagged sobs. "I am useless. In Shillong, I couldn't understand the books. I lost my scholarship. The people in the village gave their hard-earned money for my fees, and I have brought back nothing but dirt. I am only an empty husk."

Ka Pu stood above him on the path. He did not offer a patronizing word or tell him to dry his eyes. He slowly set down his own load, walked back down the trail, and knelt beside the weeping boy in the dust.

"Do you remember the story your grandfather told you around the Zawlbuk hearth?" Ka Pu asked softly, placing a heavy, scarred palm between the boy’s shoulder blades. "The fable of the hornbill and the tiny tailor-bird who wished to carry the fallen timber for the chief’s feast?"

Rina sniffled, keeping his head low.

"The little bird wept because its beak could only carry a single twig," Ka Pu continued, his voice as soothing as the mountain wind sighing through the pine needles. "It felt worthless before the eagle and the hornbill. But when the great rains came, the hornbill’s heavy logs washed down into the floodwaters, while the tailor-bird’s woven nest of tiny twigs held firm in the gale, keeping the young safe. In our land, Rina, greatness is not measured by the crown on your head or the English words in your mouth. It is measured by Tlawmngaihna—to be steadfast, to put others before yourself, to carry your brother’s shame without letting him feel small."

The old man gently took Rina’s trembling, scraped hands into his own calloused ones.

"You have not failed this village, Ka Tupa. You only forgot that a bamboo shoot cannot grow if it is planted in stone. Help me lift the bundle. Let us weave something true."

That afternoon, beneath the veranda, the lessons began.

At first, Rina’s fingers were clumsy. The sharp bamboo strips bit into his skin, and his corners were crooked. But day after day, as the village prepared for the great spring festival, the boy sat beside the elder. Ka Pu taught him how to read the grain of the cane with his eyes shut, how to soften the reeds over the blue smoke of a charcoal ember, and how to lock the corners with the double-interlocking weave that had kept Mizo granaries dry through centuries of monsoon storms.

As the boy's hands grew calloused, his eyes cleared. The heavy, dark fog in his mind seemed to unravel with every strip of bamboo he planed into shape. In the evenings, young men from the village youth league stopped by the porch to share dried beef, laugh, and ask after the progress of the baskets. No one spoke of Shillong; no one asked for their money back. When they saw Rina working by Ka Pu's side, they clapped him on the shoulder, calling him Unau—brother.

On the eve of Chapchar Kut, the village square was lit with blazing bonfires.

The sound of the gongs echoed off the limestone bluffs, rhythmic and hypnotic. Girls in embroidered Puanchei skirts, adorned with silver chains and wild red berries, stepped lightly between the rhythmically clacking bamboo poles of the Cheraw dance.

In the center of the clearing, piled high upon woven mats, sat twelve magnificent harvest baskets, their pale surfaces polished to a golden sheen with beeswax. On the front of the largest basket—the ceremonial offering vessel meant for the village granary—the traditional interlocking pattern was so tight and symmetrical that it seemed to ripple like water under the firelight.

The village Val Upa, an elder with hair as white as river foam, lifted the ceremonial basket high above his head for all to see.

"Who has crafted this vessel of blessings?" the elder called out over the singing crowd. "For forty years, only Pu Laldina has shaped the cane with such an honest heart."

Ka Pu stood near the edge of the circle, wrapped in his finest red-and-black ceremonial shawl. He smiled, his dark eyes brimming with unshed moisture, and gently placed both hands on Rina’s shoulders, guiding the young man forward into the full warmth of the firelight.

"The hands that wove it belong to the future of our hills," Ka Pu’s voice rang out, clear and steady over the drumbeats. "My grandson, Rina."

A collective murmur of admiration rippled through the gathering, followed by a warm, resonant cheer that echoed off the mist-crowned cliffs of Reiek. The village mothers clapped their hands, their eyes bright with pride, welcoming their boy home not as a failed scholar, but as a keeper of their living soul.

Rina looked down at the basket, then turned to the old man beside him. A single tear slipped down the youth’s cheek—not of shame, but of an overwhelming, heart-mending gratitude.

He took Ka Pu’s rough, scarred hand and held it between his own, feeling the ancient, steady heartbeat of the hills passing quietly from one generation to the next.`,
  },
  {
    id: 'story-beneath-the-phumdi',
    title: 'Beneath the Phumdi',
    category: 'Folk-Wisdom',
    regionState: 'Manipur',
    district: 'Loktak / Bishnupur',
    language: 'mni',
    durationMinutes: 8,
    coverImage: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80',
    tags: ['Loktak Lake', 'Phumdi', 'Manipur', 'Keibul Lamjao', 'Moirang', 'Pakhangba', 'Folk Wisdom'],
    synopsis: 'On the floating islands of Loktak Lake, a wise matriarch reconciles two quarreling fishermen over severed nets using an ancient riddle of Pakhangba, Khamba-Thoibi, and the fragile unity of floating reeds.',
    fullScript: `The dusk on Loktak did not arrive by the clock; it descended when the shadow of the Thangjing hills reached across the water to touch the reeds of Keibul Lamjao. Out on the open expanse, the lake turned into a sheet of hammered copper. The great circular rings of floating biomass—the phumdis, thick with peat, roots, and wild grass—drifted so gently upon the surface that the small thatched phumshangs resting upon them seemed to float between two skies.

Along the outer edge of the leirak, where the water-lanes met the dry bank, the courtyard of the Ningthoujam homestead smelled of bruised holy basil, dried bamboo shoots, and the pungent, comforting steam of ngari fish curry bubbling over an earthen hearth.

In the center of the swept earth, beside a venerable heikru tree, Ema Sanatombi sat on a woven reed mat. Her phanek, striped in shades of indigo and madder, was tucked neatly around her waist, and across her frail shoulders lay a cream-colored innaphi fine as dragonfly wings. Her silver hair, coiled into a modest knot, shone in the evening glow.

Before her, the courtyard was thick with an uneasy silence.

Two men sat on low wooden stools opposite each other, their faces turned away like quarreling cocks.

One was her son, Tombi, his dark knuckles gray with dried lake-muck from a day spent hauling nets. The other was Chaoba from the neighboring sagei, whose family had tied their floating huts alongside the Ningthoujam fish-traps for four generations. Between them on the earth lay a severed nylon gill-net, neatly slashed through its float line.

"The northern channel of the athaphum belongs to my father's line, Ema," Tombi muttered, his gaze fixed bitterly on the dirt. "His boys set their bamboo poles across the water-path where the sareng fish run to spawn. When my dugout pushed through at dawn, his nets were snarled in my paddle. He took a sickle to my cord."

"Your paddle had eyes, Tombi," Chaoba snapped back, his voice rising, stiff with indignation. "You drove your canoe hard to break the surface before sunrise because you wanted the catch for the Moirang bazaar! The water beneath a phumdi has no fences. My grandfather anchored this mat of grass when yours was still wearing a child's loincloth."

"Enough," said a voice from the shadow of the veranda. Pabung Ibotombi, the elder brother, leaned against a wooden pillar, his jaw clenched, ready to take up his family's cause.

The air had grown sharp. In the wetlands, when neighboring clans turn their eyes aside, small cuts soon widen into chasms that poison an entire village.

Ema Sanatombi did not look up from her hands. She was slicing fresh thambou—crisp, pale lotus stems—into a brass bowl. With each rhythmic stroke of her small knife, the fibrous rings fell like ivory coins: snip, drop, snip, drop.

Near the kitchen door, two young grandchildren sat huddled together, watching the grown men with wide, fearful eyes.

"Iche," the grandmother called softly toward the kitchen, where her eldest daughter was stoking the fire. "Bring out the hot tea with ginger. And bring a bowl of popped rice for the little ones."

She wiped her knife on a dry linen cloth, folded her hands over her knees, and let her gaze drift toward the lake.

Far across the water, the horn of an evening brow-antlered deer—the sangai—sounded once from the reeds of the national park, an ancient, whistling bark that hung in the still air like a bell.

"Before the kings built their brick gateways at Kangla," Ema began, her voice low, measured, and sweet as cane juice, "who was it that swam beneath the floor of the world?"

The two angry men shifted uncomfortably, but out of lifelong habit, they held their tongues. When Ema Sanatombi spoke in that rhythmic cadence, the courtyard belonged to her.

"The great ancestor Pakhangba," she said, tracing a slow circle in the dry earth with her forefinger. "The divine serpent who holds his own tail in his mouth. In the mornings he is a child of the sun, in the afternoons a warrior with a spear of bronze, and at night, he curls deep beneath the roots of the water-plants, where no man's eye can reach. He made the seven clans from the seven folds of his skin."

She paused, looking up through the darkening branches of the fruit tree.

"Listen to an old woman's riddle, my sons," she said, looking first at Tombi, then directly into Chaoba’s sullen eyes. "Tell me: When the noble Khamba ran the great race through the fields of Moirang to win the favor of Princess Thoibi, which horse carried him to the finish line?"

Tombi frowned, perplexed by the sudden turn. "Khamba had no horse, Ema. Every child knows the ballad of Moirang. He ran on his own two feet, bare against the thorns and the mud."

"Indeed," Ema nodded gently. "And tell me, Chaoba—when the wild bull of the Khuman hills charged through the marshland, threatening to tear the villages from their moorings, how did Khamba capture the beast?"

Chaoba cleared his throat, his anger momentarily stalled by the memory of the ancient epic that was sung every spring at the Lai Haraoba. "He... he used the sacred golden rope given by Thoibi. But he could not throw it until the beast turned to face him. He had to stand in the creature’s breath without flinching."

"Without flinching," Ema repeated softly. "Not with an iron blade. Not by poisoning the beast’s drinking pool in the dark. He conquered through patience, honor, and a rope woven from love."

She picked up two severed ends of the green nylon fishing net that lay between them on the ground.

"Now solve the second part of the riddle," she said, holding the two frayed cords apart. "The water is one, but the net has two ends. If the water decides to turn to ice, whose fish will it keep? And when the flood comes down from the hills in the monsoon, whose phumdi will stay dry while the other drowns?"

Silence settled over the courtyard. The distant sound of a pung—the double-headed drum—thrummed from the temple across the inlet, its hollow cadence marking the evening prayer.

"Neither," Chaoba murmured, looking down at his rough, bare feet.

"Neither," Ema agreed, her eyes warm with ancient knowing. "You argue over three arms-lengths of open water, as if the lake were a strip of clay you can mark with stones. Have you forgotten what a phumdi is? It is not earth. It is nothing more than grass, decaying stems, and weed, bound together by time and water. If a single reed says, 'I will not touch my brother,' the mat rots from within, breaks apart in the night wind, and the huts sink into the black mud."

She reached out and took Tombi’s calloused hand, then stretched her other hand across the space to take Chaoba’s. Her touch was papery and dry, yet her grip held the unyielding spine of an elder who had buried three generations of strife.

"Your father, Chaoba, was the one who pulled Tombi out of the whirlpool behind the Karang island when his boat overturned forty years ago. And when the cholera came before the great war, it was my mother who nursed your sisters with bitter herbs from the forest. You share the same fish; you drink from the same deep currents that flow past the shrine of Lord Thangjing."

She laid the two severed ends of the net across Chaoba’s palm and closed his fingers over them.

"The water does not belong to the fisherman, my sons," she said, her voice dropping into a solemn hush. "The fisherman belongs to the water. When we dance the pung cholom before the spirits, we bend low to touch the ground not because the ground is rich, but because the ground forgives our heavy steps."

Tombi looked across at his neighbor. The tight knot in his jaw slowly uncoiled. He reached into the woven bag at his waist, drew out a bone-handled net-mending shuttle wound with stout green twine, and placed it quietly beside Chaoba’s hand.

"Tomorrow before the mist lifts," Tombi said in a low voice, "we will set the stake poles together at the southern bend. The sareng run deeper there anyway."

Chaoba looked at the shuttle, then up at Tombi. He gave a single, firm nod. "I have two spare bundles of seasoned cane behind my hut. We will brace the outer ring before the southwest wind rises."

From the veranda, Pabung Ibotombi let out a long breath, stepping down to set a small oil lamp upon the stone plinth beneath the heikru tree. Its small, flickering flame caught the surface of the lake just beyond the fence, mirroring the first star of the evening.

"Come," Ema Sanatombi said, smiling as the wrinkles around her eyes crinkled like dried lotus leaves. "The fish curry is cooked. The young ones have eaten their popped rice. Sit together and take your salt."

The men rose, the shadow between them washed away into the dark, patient waters of Loktak, while the old grandmother bent once more to her herbs, humming a fragment of a song so old that even the lake itself seemed to pause and listen.`,
  },
];

