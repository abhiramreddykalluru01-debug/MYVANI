import type { SituationLineKey, SituationLocalizedLine } from "@/lib/situation/locale";

const hi = (
  phonetic: string,
  native: string,
): SituationLocalizedLine => ({ phonetic, native });

/** Hindi phonetic + Devanagari for static situation scripts. */
export const SITUATION_HI_LINES: Record<
  SituationLineKey,
  SituationLocalizedLine
> = {
  // ── Auto ────────────────────────────────────────────────────────────────
  "auto-banashankari|flat|t0|user|Anna, will you go to Banashankari?": hi(
    "bhai-ya, ban-na-shan-ka-ri jaa-o-ge?",
    "भैया, बनशंकरी जाओगे?",
  ),
  "auto-banashankari|flat|t1|other:r0|Yes, come.": hi(
    "haan, aa-i-ye",
    "हाँ, आइये",
  ),
  "auto-banashankari|flat|t1|other:r1|Which Banashankari — 1st stage or 2nd?": hi(
    "kaun-sa ban-na-shan-ka-ri? first stage ya second?",
    "कौनसा बनशंकरी? फर्स्ट स्टेज या सेकंड?",
  ),
  "auto-banashankari|flat|t1|other:r2|That side is jam now.": hi(
    "wa-han traf-fic bahut hai",
    "वहाँ ट्रैफिक बहुत है",
  ),
  "auto-banashankari|flat|t2|user|Anna, how much?": hi(
    "bhai-ya, kit-na hua?",
    "भैया, कितना हुआ?",
  ),
  "auto-banashankari|flat|t3|other:r0|One hundred rupees.": hi(
    "sau ru-paye",
    "सौ रुपये",
  ),
  "auto-banashankari|flat|t3|other:r1|One fifty.": hi(
    "sau pa-chaas",
    "सौ पचास",
  ),
  "auto-banashankari|flat|t3|other:r2|Two hundred.": hi(
    "do sau",
    "दो सौ",
  ),
  "auto-banashankari|flat|t4|user|Okay, one fifty is fine. Please go.": hi(
    "theek hai sau pa-chaas, cha-li-ye",
    "ठीक है सौ पचास, चलिए",
  ),
  "auto-banashankari|flat|t5|other:r0|Okay, sit.": hi(
    "theek hai, baith-i-ye",
    "ठीक है, बैठिए",
  ),
  "auto-banashankari|flat|t5|other:r1|Come quickly.": hi(
    "jal-di aa-i-ye",
    "जल्दी आइये",
  ),

  // ── Hospital phase 1 ────────────────────────────────────────────────────
  "hospital-visit|p1|t0|user|I need an appointment to see the doctor.": hi(
    "doc-tor se mil-ne ka ap-point-ment cha-hi-ye",
    "डॉक्टर से मिलने का अपॉइंटमेंट चाहिए",
  ),
  "hospital-visit|p1|t1|other:r0|OP or emergency?": hi(
    "O-P hai ya emer-gen-cy?",
    "ओपी है या इमरजेंसी?",
  ),
  "hospital-visit|p1|t1|other:r1|Which department — general medicine?": hi(
    "kaun-sa de-part-ment? ge-ne-ral?",
    "कौनसा डिपार्टमेंट? जनरल?",
  ),
  "hospital-visit|p1|t1|other:r2|First time here? Please fill this form.": hi(
    "peh-li baar? form bhar-i-ye",
    "पहली बार? फॉर्म भरिए",
  ),
  "hospital-visit|p1|t2|user|I have had fever for two days. My phone number is …": hi(
    "do din se buk-haar hai, phone num-ber …",
    "दो दिन से बुखार है, फोन नंबर …",
  ),
  "hospital-visit|p1|t3|other:r0|Write name, age, and problem clearly.": hi(
    "naam, umr, problem saaf likh-i-ye",
    "नाम, उम्र, प्रॉब्लम साफ लिखिए",
  ),
  "hospital-visit|p1|t3|other:r1|Pay registration fee at that counter.": hi(
    "us coun-ter par reg-is-tra-shan pay kee-ji-ye",
    "उस काउंटर पर रजिस्ट्रेशन पे कीजिए",
  ),
  "hospital-visit|p1|t3|other:r2|Wait — we will call your token number.": hi(
    "ru-kiye, token num-ber call ka-ren-ge",
    "रुकिए, टोकन नंबर कॉल करेंगे",
  ),
  "hospital-visit|p1|t4|user|Roughly how long is the wait?": hi(
    "kit-na time lage-ga?",
    "कितना टाइम लगेगा?",
  ),
  "hospital-visit|p1|t5|other:r0|Around twenty to thirty minutes.": hi(
    "bees se tees min-ut",
    "बीस से तीस मिनट",
  ),
  "hospital-visit|p1|t5|other:r1|Doctor is on rounds — a little delay.": hi(
    "doc-tor rounds par hain, tho-da late",
    "डॉक्टर राउंड्स पर हैं, थोड़ा लेट",
  ),

  // ── Hospital phase 2 ────────────────────────────────────────────────────
  "hospital-visit|p2|t0|user|Doctor, I have had fever and body ache for two days.": hi(
    "doc-tor sahab, do din se buk-haar aur ba-dan dard",
    "डॉक्टर साहब, दो दिन से बुखार और बदन दर्द",
  ),
  "hospital-visit|p2|t1|other:r0|Since when? Any cough or cold?": hi(
    "kab se? khas-si-zu-ka-m?",
    "कब से? खांसी-जुकाम?",
  ),
  "hospital-visit|p2|t1|other:r1|Open your mouth — say aaah.": hi(
    "munh khol kar aaah bol-i-ye",
    "मुंह खोलकर आह बोलिए",
  ),
  "hospital-visit|p2|t1|other:r2|Any medicine you are already taking?": hi(
    "koi dwaai le ra-he hain?",
    "कोई दवाई ले रहे हैं?",
  ),
  "hospital-visit|p2|t2|user|I took paracetamol — a little better only.": hi(
    "par-a-se-ta-mol li-ya, tho-da aaraam",
    "पैरासिटामोल लिया, थोड़ा आराम",
  ),
  "hospital-visit|p2|t3|other:r0|We will send you for a blood test.": hi(
    "blood test ke li-ye bhej-en-ge",
    "ब्लड टेस्ट के लिए भेजेंगे",
  ),
  "hospital-visit|p2|t3|other:r1|Take this prescription — after food, twice a day.": hi(
    "ye pre-scrip-tion, khana kha-ne ke baad din mein do baar",
    "ये प्रिस्क्रिप्शन, खाना खाने के बाद दिन में दो बार",
  ),
  "hospital-visit|p2|t3|other:r2|Come back if fever is still high after three days.": hi(
    "teen din baad bhi buk-haar ho to aa ja-i-ye",
    "तीन दिन बाद भी बुखार हो तो आ जाइए",
  ),
  "hospital-visit|p2|t4|user|Should I pay at billing first?": hi(
    "peh-le bil-ling par pay kar-un?",
    "पहले बिलिंग पर पे करूँ?",
  ),
  "hospital-visit|p2|t5|other:r0|Yes — pay there, then pharmacy or lab as written.": hi(
    "haan, wahan pay kee-ji-ye, phir phar-ma-si ya lab",
    "हाँ, वहाँ पे कीजिए, फिर फार्मसी या लैब",
  ),
  "hospital-visit|p2|t5|other:r1|Keep this slip with you.": hi(
    "ye slip saath rak-hi-ye",
    "ये स्लिप साथ रखिए",
  ),

  // ── Hospital phase 3 ────────────────────────────────────────────────────
  "hospital-visit|p3|t0|user|I need to pay for consultation and the blood test.": hi(
    "con-sul-ta-tion aur blood test ka pay kar-na hai",
    "कन्सल्टेशन और ब्लड टेस्ट का पे करना है",
  ),
  "hospital-visit|p3|t1|other:r0|Show the doctor slip and your ID.": hi(
    "doc-tor slip aur I-D dikhaa-i-ye",
    "डॉक्टर स्लिप और आईडी दिखाइए",
  ),
  "hospital-visit|p3|t1|other:r1|Total five hundred rupees.": hi(
    "kul paan-so ru-paye",
    "कुल पाँच सौ रुपये",
  ),
  "hospital-visit|p3|t1|other:r2|Card, UPI, or cash?": hi(
    "card? U-P-I? cash?",
    "कार्ड? यूपीआई? कैश?",
  ),
  "hospital-visit|p3|t2|user|I'll pay by UPI. Give me the bill.": hi(
    "U-P-I se pay kar-un-ga, bill de di-ji-ye",
    "यूपीआई से पे करूँगा, बिल दे दीजिए",
  ),
  "hospital-visit|p3|t3|other:r0|Scan this QR code.": hi(
    "ye Q-R scan kee-ji-ye",
    "ये क्यूआर स्कैन कीजिए",
  ),
  "hospital-visit|p3|t3|other:r1|Take this receipt to the lab window.": hi(
    "ye re-ce-ipt lab win-dow par le ja-a-i-ye",
    "ये रसीद लैब विंडो पर ले जाइए",
  ),
  "hospital-visit|p3|t4|user|Thank you.": hi(
    "shuk-ri-ya",
    "शुक्रिया",
  ),
  "hospital-visit|p3|t5|other:r0|Welcome — next patient please.": hi(
    "swa-gat, ag-la pa-tient",
    "स्वागत, अगला पेशेंट",
  ),

  // ── Hospital phase 4 ────────────────────────────────────────────────────
  "hospital-visit|p4|t0|user|Sister, give these medicines from the prescription.": hi(
    "didi, ye dwaai-yan pre-scrip-tion ke hisaab se de di-ji-ye",
    "दीदी, ये दवाइयाँ प्रिस्क्रिप्शन के हिसाब से दे दीजिए",
  ),
  "hospital-visit|p4|t1|other:r0|Wait — let me check all items.": hi(
    "ru-kiye, check kar-ta hoon",
    "रुकिए, चेक करता हूँ",
  ),
  "hospital-visit|p4|t1|other:r1|This tablet is out of stock — same salt substitute ok?": hi(
    "ye tab-let khat-am, same salt sub-sti-tute theek?",
    "ये टैबलेट खत्म, सेम साल्ट सब्स्टिट्यूट ठीक?",
  ),
  "hospital-visit|p4|t1|other:r2|Before food or after food — I will explain.": hi(
    "khana se peh-le ya baad mein, samjha dun-ga",
    "खाना से पहले या बाद में, समझा दूँगा",
  ),
  "hospital-visit|p4|t2|user|Substitute is fine if the doctor allows.": hi(
    "sub-sti-tute theek hai agar doc-tor ne kaha",
    "सब्स्टिट्यूट ठीक है अगर डॉक्टर ने कहा",
  ),
  "hospital-visit|p4|t3|other:r0|Then take this strip — after food at night.": hi(
    "to ye strip le li-ji-ye, raat ko khana kha-ne ke baad",
    "तो ये स्ट्रिप ले लीजिए, रात को खाना खाने के बाद",
  ),
  "hospital-visit|p4|t3|other:r1|Read the dose on the cover.": hi(
    "cover par doze padh li-ji-ye",
    "कवर पर डोज़ पढ़ लीजिए",
  ),
  "hospital-visit|p4|t4|user|What is the total?": hi(
    "kul kit-na?",
    "कुल कितना?",
  ),
  "hospital-visit|p4|t5|other:r0|Two hundred and eighty rupees.": hi(
    "do sau as-si ru-paye",
    "दो सौ अस्सी रुपये",
  ),
  "hospital-visit|p4|t5|other:r1|UPI is available here.": hi(
    "yahan U-P-I hai",
    "यहाँ यूपीआई है",
  ),
  "hospital-visit|p4|t6|user|Paid. Thank you.": hi(
    "pay ho gaya, shuk-ri-ya",
    "पे हो गया, शुक्रिया",
  ),
  "hospital-visit|p4|t7|other:r0|Take care — get well soon.": hi(
    "khyal rak-hi-ye, jal-di theek ho ja-a-i-ye",
    "ख्याल रखिए, जल्दी ठीक हो जाइए",
  ),

  // ── Bus ─────────────────────────────────────────────────────────────────
  "bus-conductor|flat|t0|user|Anna, I need to go to Banashankari.": hi(
    "bhai-ya, muj-he ban-na-shan-ka-ri jaa-na hai",
    "भैया, मुझे बनशंकरी जाना है",
  ),
  "bus-conductor|flat|t1|other:r0|Which stop in Banashankari?": hi(
    "ban-na-shan-ka-ri mein kaun-sa stop?",
    "बनशंकरी में कौनसा स्टॉप?",
  ),
  "bus-conductor|flat|t1|other:r1|Come inside — stand near the door.": hi(
    "an-dar aa ja-a-i-ye, door ke paas kha-de ho ja-a-i-ye",
    "अंदर आ जाइए, डोर के पास खड़े हो जाइए",
  ),
  "bus-conductor|flat|t1|other:r2|This bus goes that side — sit.": hi(
    "ye bus us taraf jaa-e-gi, baith ja-a-i-ye",
    "ये बस उस तरफ जाएगी, बैठ जाइए",
  ),
  "bus-conductor|flat|t2|user|Metro station side is fine.": hi(
    "metro station ke paas waa-la theek hai",
    "मेट्रो स्टेशन के पास वाला ठीक है",
  ),
  "bus-conductor|flat|t3|other:r0|Okay — ticket is thirty rupees.": hi(
    "theek hai, tees ru-paye ti-kat",
    "ठीक है, तीस रुपये टिकट",
  ),
  "bus-conductor|flat|t3|other:r1|Forty rupees from here.": hi(
    "yahan se cha-lis ru-paye",
    "यहाँ से चालीस रुपये",
  ),
  "bus-conductor|flat|t3|other:r2|Student pass or full ticket?": hi(
    "student pass ya full ti-kat?",
    "स्टूडेंट पास या फुल टिकट?",
  ),
  "bus-conductor|flat|t4|user|Full ticket. Here is fifty rupees.": hi(
    "full ti-kat, ye pachaas ru-paye",
    "फुल टिकट, ये पचास रुपये",
  ),
  "bus-conductor|flat|t5|other:r0|No change — exact amount only.": hi(
    "change nahin, ex-act amount",
    "चेंज नहीं, एक्जैक्ट अमाउंट",
  ),
  "bus-conductor|flat|t5|other:r1|Take your ticket — keep till you get down.": hi(
    "ti-kat le li-ji-ye, utar-ne tak rak-hi-ye",
    "टिकट ले लीजिए, उतरने तक रखिए",
  ),
  "bus-conductor|flat|t5|other:r2|Ten rupees change — take it.": hi(
    "das ru-paye change, le li-ji-ye",
    "दस रुपये चेंज, ले लीजिए",
  ),
  "bus-conductor|flat|t6|user|Please tell me when my stop comes.": hi(
    "mera stop aa-e to bata di-ji-ye-ga?",
    "मेरा स्टॉप आए तो बता दीजिएगा?",
  ),
  "bus-conductor|flat|t7|other:r0|I will call Banashankari — don’t worry.": hi(
    "ban-na-shan-ka-ri aa-e-ga to bata dun-ga, chinta mat",
    "बनशंकरी आएगा तो बता दूँगा, चिंता मत",
  ),
  "bus-conductor|flat|t7|other:r1|Two more stops — then yours.": hi(
    "do stop aur, phir aa-pa-ka",
    "दो स्टॉप और, फिर आपका",
  ),
  "bus-conductor|flat|t8|user|This is my stop — I am getting down.": hi(
    "ye mera stop hai, main utar raha hoon",
    "ये मेरा स्टॉप है, मैं उतर रहा हूँ",
  ),
  "bus-conductor|flat|t9|other:r0|Okay — get down carefully.": hi(
    "theek hai, sa-va-dhan se utar-i-ye",
    "ठीक है, सावधान से उतरिए",
  ),
  "bus-conductor|flat|t9|other:r1|Move fast — bus is starting.": hi(
    "jal-di, bus chal-ne waa-li hai",
    "जल्दी, बस चलने वाली है",
  ),

  // ── Medical shop ────────────────────────────────────────────────────────
  "medical-dolo|flat|t0|user|Anna, do you have Dolo?": hi(
    "bhai-ya, do-lo hai?",
    "भैया, डोलो है?",
  ),
  "medical-dolo|flat|t1|other:r0|Yes, we have.": hi(
    "hai hai",
    "है है",
  ),
  "medical-dolo|flat|t1|other:r1|Which one — 650 or 500?": hi(
    "kaun-sa? six-fif-ty ya five-hun-dred?",
    "कौनसा? सिक्स फिफ्टी या फाइव हंड्रेड?",
  ),
  "medical-dolo|flat|t1|other:r2|Out of stock today.": hi(
    "aaj khat-am hai",
    "आज खत्म है",
  ),
  "medical-dolo|flat|t2|user|Give me one strip.": hi(
    "ek strip de di-ji-ye",
    "एक स्ट्रिप दे दीजिए",
  ),
  "medical-dolo|flat|t3|other:r0|How many do you want?": hi(
    "kit-ne cha-hi-ye?",
    "कितने चाहिए?",
  ),
  "medical-dolo|flat|t3|other:r1|Only one?": hi(
    "ba-s ek?",
    "बस एक?",
  ),
  "medical-dolo|flat|t4|user|One is enough.": hi(
    "ek hi ka-fi hai",
    "एक ही काफी है",
  ),
  "medical-dolo|flat|t5|other:r0|Twenty rupees.": hi(
    "bees ru-paye",
    "बीस रुपये",
  ),
  "medical-dolo|flat|t5|other:r1|Thirty rupees.": hi(
    "tees ru-paye",
    "तीस रुपये",
  ),
  "medical-dolo|flat|t6|user|Here, take the money.": hi(
    "ye li-ji-ye",
    "ये लीजिए",
  ),
  "medical-dolo|flat|t7|other:r0|Okay, take this.": hi(
    "theek hai, ye le li-ji-ye",
    "ठीक है, ये ले लीजिए",
  ),
  "medical-dolo|flat|t7|other:r1|Thank you, come again.": hi(
    "shuk-ri-ya, phir aa-i-ye-ga",
    "शुक्रिया, फिर आइएगा",
  ),

  // ── PG room hunt ────────────────────────────────────────────────────────
  "pg-room-hunt|flat|t0|user|Anna, is there a PG room free near here?": hi(
    "bhai-ya, yahan paas P-G room kha-li hai?",
    "भैया, यहाँ पास पीजी रूम खाली है?",
  ),
  "pg-room-hunt|flat|t1|other:r0|Yes, one room is free.": hi(
    "haan, ek room kha-li hai",
    "हाँ, एक रूम खाली है",
  ),
  "pg-room-hunt|flat|t1|other:r1|Single or sharing?": hi(
    "sin-gle ya sha-ring?",
    "सिंगल या शेयरिंग?",
  ),
  "pg-room-hunt|flat|t1|other:r2|No vacancy now.": hi(
    "ab-hi ja-ga nahin",
    "अभी जगह नहीं",
  ),
  "pg-room-hunt|flat|t2|user|I need a single room. Is food included?": hi(
    "muj-he sin-gle room cha-hi-ye. khaa-na in-clu-ded hai?",
    "मुझे सिंगल रूम चाहिए. खाना इन्क्लूडेड है?",
  ),
  "pg-room-hunt|flat|t3|other:r0|Food yes — veg only.": hi(
    "khaa-na hai, veg hi",
    "खाना है, वेज ही",
  ),
  "pg-room-hunt|flat|t3|other:r1|No food — kitchen you can use.": hi(
    "khaa-na nahin, ki-chen yoo-z kar sa-kte",
    "खाना नहीं, किचन यूज़ कर सकते",
  ),
  "pg-room-hunt|flat|t3|other:r2|Only sharing has food.": hi(
    "sha-ring mein hi khaa-na hai",
    "शेयरिंग में ही खाना है",
  ),
  "pg-room-hunt|flat|t4|user|How much is the rent per month?": hi(
    "ma-hi-ne ka ki-raa-ya kit-na?",
    "महीने का किराया कितना?",
  ),
  "pg-room-hunt|flat|t5|other:r0|Eight thousand per month.": hi(
    "aath ha-zaar ru-paye",
    "आठ हज़ार रुपये",
  ),
  "pg-room-hunt|flat|t5|other:r1|Ten thousand — deposit extra.": hi(
    "das ha-zaar, de-po-sit a-lag",
    "दस हज़ार, डिपॉजिट अलग",
  ),
  "pg-room-hunt|flat|t5|other:r2|Six plus maintenance.": hi(
    "chhe ha-zaar, main-te-nans a-lag",
    "छह हज़ार, मेंटेनेंस अलग",
  ),
  "pg-room-hunt|flat|t6|user|Can I see the room?": hi(
    "room dekh sak-ta hoon?",
    "रूम देख सकता हूँ?",
  ),
  "pg-room-hunt|flat|t7|other:r0|Come, I will show you.": hi(
    "aa-i-ye, di-khaa-ta hoon",
    "आइये, दिखाता हूँ",
  ),
  "pg-room-hunt|flat|t7|other:r1|Evening only — people are inside.": hi(
    "shaam ko hi, an-dar log hain",
    "शाम को ही, अंदर लोग हैं",
  ),
  "pg-room-hunt|flat|t8|user|Okay, I will take it. When can I shift?": hi(
    "theek hai, le lun-ga. shift kab?",
    "ठीक है, ले लूँगा. शिफ्ट कब?",
  ),
  "pg-room-hunt|flat|t9|other:r0|Tomorrow is fine.": hi(
    "kal theek hai",
    "कल ठीक है",
  ),
  "pg-room-hunt|flat|t9|other:r1|Pay advance — then keys.": hi(
    "ad-vance pay kee-ji-ye, phir chaa-bi",
    "एडवांस पे कीजिए, फिर चाबी",
  ),

  // ── Kirana store ─────────────────────────────────────────────────────────
  "kirana-store|flat|t0|user|Anna, do you have Sona Masoori rice?": hi(
    "bhai-ya, so-na ma-su-ri chaa-wal hai?",
    "भैया, सोना मसूरी चावल है?",
  ),
  "kirana-store|flat|t1|other:r0|Yes, we have.": hi(
    "hai hai",
    "है है",
  ),
  "kirana-store|flat|t1|other:r1|Which bag — 5 kg or 10 kg?": hi(
    "kaun-sa bag? paanch kg ya das kg?",
    "कौनसा बैग? पाँच किलो या दस किलो?",
  ),
  "kirana-store|flat|t1|other:r2|Finished today — come tomorrow.": hi(
    "aaj khat-am, kal aa-i-ye",
    "आज खत्म, कल आइये",
  ),
  "kirana-store|flat|t2|user|Give me one 5 kg bag.": hi(
    "paanch kg ek bag de di-ji-ye",
    "पाँच किलो एक बैग दे दीजिए",
  ),
  "kirana-store|flat|t3|other:r0|Anything else?": hi(
    "aur kuch cha-hi-ye?",
    "और कुछ चाहिए?",
  ),
  "kirana-store|flat|t3|other:r1|Only this?": hi(
    "bas it-na?",
    "बस इतना?",
  ),
  "kirana-store|flat|t4|user|One litre Fortune oil also.": hi(
    "ek li-tre tel bhi, for-tune",
    "एक लीटर तेल भी, फॉर्च्यून",
  ),
  "kirana-store|flat|t5|other:r0|This bottle or smaller pouch?": hi(
    "ye bot-tle ya chho-ta pouch?",
    "ये बोतल या छोटा पाउच?",
  ),
  "kirana-store|flat|t5|other:r1|Sunflower only today.": hi(
    "aaj sun-flo-wer hi hai",
    "आज सनफ्लॉवर ही है",
  ),
  "kirana-store|flat|t6|user|This pouch is fine. What is the total?": hi(
    "ye pouch theek hai. kul kit-na?",
    "ये पाउच ठीक है. कुल कितना?",
  ),
  "kirana-store|flat|t7|other:r0|Four hundred fifty rupees.": hi(
    "chaar sau pa-chaas ru-paye",
    "चार सौ पचास रुपये",
  ),
  "kirana-store|flat|t7|other:r1|Five hundred rupees.": hi(
    "paanch sau ru-paye",
    "पाँच सौ रुपये",
  ),
  "kirana-store|flat|t8|user|I will pay by UPI.": hi(
    "U-P-I se pay kar-un-ga",
    "यूपीआई से पे करूँगा",
  ),
  "kirana-store|flat|t9|other:r0|Scan here.": hi(
    "yahan scan kee-ji-ye",
    "यहाँ स्कैन कीजिए",
  ),
  "kirana-store|flat|t9|other:r1|Cash only today — ATM is there.": hi(
    "aaj cash hi, A-T-M wahan hai",
    "आज कैश ही, एटीएम वहाँ है",
  ),
  "kirana-store|flat|t10|user|Paid. Thank you, anna.": hi(
    "pay ho gaya. shuk-ri-ya bhai-ya",
    "पे हो गया. शुक्रिया भैया",
  ),
  "kirana-store|flat|t11|other:r0|Okay, come again.": hi(
    "theek hai, phir aa-i-ye",
    "ठीक है, फिर आइये",
  ),
};
