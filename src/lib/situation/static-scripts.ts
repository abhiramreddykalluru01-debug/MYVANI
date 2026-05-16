/**
 * Pre-written situation conversations — read-only on /situation.
 * Add more entries here when you want new scripts live.
 */

import type { LanguageCode } from "@/types/db";
import { localizeSituationScript } from "@/lib/situation/locale";
import { SITUATION_HI_LINES } from "@/lib/situation/static-scripts-hi";
import type { StaticSituationScript } from "@/lib/situation/types";

export type {
  StaticReply,
  StaticSituationPhase,
  StaticSituationScript,
  StaticTurn,
  StaticUserTurn,
  StaticOtherTurn,
} from "@/lib/situation/types";

/** Curated scripts shown on the Situation page (no generation). */
export const STATIC_SITUATION_SCRIPTS: StaticSituationScript[] = [
  {
    id: "auto-banashankari",
    title: "At the auto stand",
    contextEnglish:
      "You walk up to an auto. You need to go to Banashankari (or a nearby area).",
    other_label: "Auto driver",
    other_emoji: "🚗",
    end_note: "You agree on the fare and get in — you are on your way.",
    turns: [
      {
        speaker: "user",
        english: "Anna, will you go to Banashankari?",
        phonetic: "an-na ban-na-shan-ka-ri-ge hog-tee-ra?",
        native: "ಅಣ್ಣ, ಬನ್ನಶಂಕರಿಗೆ ಹೋಗ್ತೀರಾ?",
      },
      {
        speaker: "other",
        replies: [
          {
            english: "Yes, come.",
            phonetic: "hau-du ba-ni",
            native: "ಹೌದು, ಬನ್ನಿ",
          },
          {
            english: "Which Banashankari — 1st stage or 2nd?",
            phonetic: "ya-va-ban-na-shan-ka-ri? first stage-a? second-a?",
            native: "ಯಾವ ಬನ್ನಶಂಕರಿ? ಫಸ್ಟ್ ಸ್ಟೇಜಾ? ಸೆಕೆಂಡಾ?",
          },
          {
            english: "That side is jam now.",
            phonetic: "al-li traf-fic ja-asti",
            native: "ಅಲ್ಲಿ ಟ್ರಾಫಿಕ್ ಜಾಸ್ತಿ",
          },
        ],
      },
      {
        speaker: "user",
        english: "Anna, how much?",
        phonetic: "anna estu ag-ut-te?",
        native: "ಅಣ್ಣ ಎಷ್ಟು ಆಗುತ್ತೆ?",
      },
      {
        speaker: "other",
        replies: [
          {
            english: "One hundred rupees.",
            phonetic: "noo-ru roo-pa-yi",
            native: "ನೂರು ರೂಪಾಯಿ",
          },
          {
            english: "One fifty.",
            phonetic: "noo-ru ai-dhu",
            native: "ನೂರು ಐದು",
          },
          {
            english: "Two hundred.",
            phonetic: "ee-ru noo-ru",
            native: "ಎರಡು ನೂರು",
          },
        ],
      },
      {
        speaker: "user",
        english: "Okay, one fifty is fine. Please go.",
        phonetic: "seri noo-ru ai-dhu seri hog-ri",
        native: "ಸರಿ, ನೂರು ಐದು ಸರಿ, ಹೋಗ್ರಿ",
      },
      {
        speaker: "other",
        replies: [
          {
            english: "Okay, sit.",
            phonetic: "seri ku-lith-kol-li",
            native: "ಸರಿ, ಕುಳಿತ್ಕೊಳ್ಳಿ",
          },
          {
            english: "Come quickly.",
            phonetic: "beg-a ba-ni",
            native: "ಬೇಗ ಬನ್ನಿ",
          },
        ],
      },
    ],
  },
  {
    id: "hospital-visit",
    title: "Full hospital visit",
    contextEnglish:
      "From walking in to leaving with medicine: reception → doctor → billing → pharmacy counter.",
    other_label: "Hospital",
    other_emoji: "🏥",
    end_note:
      "You moved through all four phases — follow any extra steps for lab tests, then you are done.",
    turns: [],
    phases: [
      {
        phase: 1,
        title: "Reception",
        other_label: "Receptionist",
        other_emoji: "🏥",
        turns: [
          {
            speaker: "user",
            english: "I need an appointment to see the doctor.",
            phonetic: "doc-tor no-do-ke ap-point-ment be-ku",
            native: "ಡಾಕ್ಟರ್ ನೋಡೋಕೆ ಅಪಾಯಿಂಟ್ಮೆಂಟ್ ಬೇಕು",
          },
          {
            speaker: "other",
            replies: [
              {
                english: "OP or emergency?",
                phonetic: "O-P-a? emer-gen-cy-a?",
                native: "ಒಪಿಆ? ಎಮರ್ಜೆನ್ಸಿಯಾ?",
              },
              {
                english: "Which department — general medicine?",
                phonetic: "ya-va de-part-ment? jee-naral med-sin-a?",
                native: "ಯಾವ ಡಿಪಾರ್ಟ್ಮೆಂಟ್? ಜನರಲ್ ಮೆಡಿಸಿನಾ?",
              },
              {
                english: "First time here? Please fill this form.",
                phonetic: "moda-la sa-ri-na? form fill ma-di",
                native: "ಮೊದಲ ಸರಿನಾ? ಫಾರ್ಮ್ ಫಿಲ್ ಮಾಡಿ",
              },
            ],
          },
          {
            speaker: "user",
            english: "I have had fever for two days. My phone number is …",
            phonetic:
              "nan-ge jva-ra ee-ru din-da idhe phone num-ber …",
            native: "ನಂಗೆ ಜ್ವರ ಎರಡು ದಿನದಿಂದಿದೆ. ಫೋನ್ ನಂಬರ್ …",
          },
          {
            speaker: "other",
            replies: [
              {
                english: "Write name, age, and problem clearly.",
                phonetic: "hesaru vaya-su samas-ye spa-sha-ta-vagi bare-yi",
                native: "ಹೆಸರು ವಯಸು ಸಮಸ್ಯೆ ಸ್ಪಷ್ಟವಾಗಿ ಬರೆಯಿ",
              },
              {
                english: "Pay registration fee at that counter.",
                phonetic: "aa coun-ter-alli reg-is-tra-shan pay ma-a-di",
                native: "ಆ ಕೌಂಟರಲ್ಲಿ ರಿಜಿಸ್ಟ್ರೇಶನ್ ಪೇ ಮಾಡಿ",
              },
              {
                english: "Wait — we will call your token number.",
                phonetic: "ka-yi-ri token num-ber call ma-a-dut-ti-ve",
                native: "ಕಾಯಿರಿ ಟೋಕನ್ ನಂಬರ್ ಕಾಲ್ ಮಾಡುತ್ತೀವಿ",
              },
            ],
          },
          {
            speaker: "user",
            english: "Roughly how long is the wait?",
            phonetic: "yeshtu time ag-ut-te?",
            native: "ಎಷ್ಟು ಟೈಮ್ ಆಗುತ್ತೆ?",
          },
          {
            speaker: "other",
            replies: [
              {
                english: "Around twenty to thirty minutes.",
                phonetic: "im-bat-thu mu-vat-thu nim-sha",
                native: "ಇಪ್ಪತ್ತು ಮೂವತ್ತು ನಿಮಿಷ",
              },
              {
                english: "Doctor is on rounds — a little delay.",
                phonetic: "doc-tor rounds me-le swal-pa late",
                native: "ಡಾಕ್ಟರ್ ರೌಂಡ್ಸ್ ಮೇಲೆ ಸ್ವಲ್ಪ ಲೇಟ್",
              },
            ],
          },
        ],
      },
      {
        phase: 2,
        title: "With the doctor",
        other_label: "Doctor",
        other_emoji: "🧑‍⚕️",
        turns: [
          {
            speaker: "user",
            english: "Doctor, I have had fever and body ache for two days.",
            phonetic:
              "doc-tor nan-ge jva-ra shar-ira-na no-vu ee-ru din-da",
            native: "ಡಾಕ್ಟರ್, ನಂಗೆ ಜ್ವರ ಶರೀರನೋವು ಎರಡು ದಿನದಿಂದ",
          },
          {
            speaker: "other",
            replies: [
              {
                english: "Since when? Any cough or cold?",
                phonetic: "ya-va-gin-da? ka-sa-zu-ka-a? jva-ra yeshtu?",
                native: "ಯಾವಾಗಿನ್ದ? ಕೆಸರುಕೆ? ಜ್ವರ ಎಷ್ಟು?",
              },
              {
                english: "Open your mouth — say aaah.",
                phonetic: "baa-ya the-gon-di aaah an-ni",
                native: "ಬಾಯ ತೆಗೊಂಡಿ ಆಹ್ ಅನ್ನಿ",
              },
              {
                english: "Any medicine you are already taking?",
                phonetic: "ya-va medi-sin teg-on-du id-deera?",
                native: "ಯಾವ ಮೆಡಿಸಿನ್ ತೆಗೊಂಡಿದ್ದೀರಾ?",
              },
            ],
          },
          {
            speaker: "user",
            english: "I took paracetamol — a little better only.",
            phonetic:
              "par-ra-se-ta-mol teg-on-de swal-pa relief",
            native: "ಪ್ಯಾರಾಸಿಟಾಮಾಲ್ ತೆಗೊಂಡೆ ಸ್ವಲ್ಪ ರಿಲೀಫ್",
          },
          {
            speaker: "other",
            replies: [
              {
                english: "We will send you for a blood test.",
                phonetic: "blood test-ge kals-kol-ti-ve",
                native: "ಬ್ಲಡ್ ಟೆಸ್ಟ್ಗೆ ಕಳಿಸ್ಕೊಳ್ತೀವಿ",
              },
              {
                english: "Take this prescription — after food, twice a day.",
                phonetic: "ee prescription oota mele eradu sala",
                native: "ಈ ಪ್ರಿಸ್ಕ್ರಿಪ್ಶನ್ ಊಟ ಮೇಲೆ ಎರಡು ಸಲ",
              },
              {
                english: "Come back if fever is still high after three days.",
                phonetic: "mu-ru din-da jva-ra ir-li ma-tte ba-n-ni",
                native: "ಮೂರು ದಿನದ ಜ್ವರ ಇರ್ಲಿ ಮತ್ತೆ ಬನ್ನಿ",
              },
            ],
          },
          {
            speaker: "user",
            english: "Should I pay at billing first?",
            phonetic: "billing-alli moda-lu pay ma-a-dla?",
            native: "ಬಿಲ್ಲಿಂಗಲ್ಲಿ ಮೊದಲು ಪೇ ಮಾಡ್ಲಾ?",
          },
          {
            speaker: "other",
            replies: [
              {
                english: "Yes — pay there, then pharmacy or lab as written.",
                phonetic: "hau-du al-li pay ma-a-di aa me-le farm-a-si",
                native: "ಹೌದು ಅಲ್ಲಿ ಪೇ ಮಾಡಿ ಆ ಮೇಲೆ ಫಾರ್ಮಸಿ",
              },
              {
                english: "Keep this slip with you.",
                phonetic: "ee slip jote-yalli i-di",
                native: "ಈ ಸ್ಲಿಪ್ ಜೊತೆಯಲ್ಲಿ ಇಡಿ",
              },
            ],
          },
        ],
      },
      {
        phase: 3,
        title: "Billing",
        other_label: "Billing desk",
        other_emoji: "🧾",
        turns: [
          {
            speaker: "user",
            english: "I need to pay for consultation and the blood test.",
            phonetic:
              "con-sul-ta-shan mat-thu blood test-ge pay ma-a-dla?",
            native: "ಕನ್ಸಲ್ಟೇಶನ್ ಮತ್ತು ಬ್ಲಡ್ ಟೆಸ್ಟ್ಗೆ ಪೇ ಮಾಡ್ಲಾ?",
          },
          {
            speaker: "other",
            replies: [
              {
                english: "Show the doctor slip and your ID.",
                phonetic: "doc-tor slip mat-thu I-D thors-i",
                native: "ಡಾಕ್ಟರ್ ಸ್ಲಿಪ್ ಮತ್ತು ಐಡಿ ತೋರ್ಸಿ",
              },
              {
                english: "Total five hundred rupees.",
                phonetic: "total aid-hu noo-ru roo-pa-yi",
                native: "ಟೋಟಲ್ ಐದು ನೂರು ರೂಪಾಯಿ",
              },
              {
                english: "Card, UPI, or cash?",
                phonetic: "card-a? U-P-I-a? cash-a?",
                native: "ಕಾರ್ಡಾ? ಯುಪಿಐಯಾ? ಕ್ಯಾಶಾ?",
              },
            ],
          },
          {
            speaker: "user",
            english: "I'll pay by UPI. Give me the bill.",
            phonetic: "U-P-I pay ma-a-dte-ni bill ko-di",
            native: "ಯುಪಿಐ ಪೇ ಮಾಡ್ತೀನಿ ಬಿಲ್ ಕೊಡಿ",
          },
          {
            speaker: "other",
            replies: [
              {
                english: "Scan this QR code.",
                phonetic: "ee Q-R scan ma-di",
                native: "ಈ ಕ್ಯೂಆರ್ ಸ್ಕ್ಯಾನ್ ಮಾಡಿ",
              },
              {
                english: "Take this receipt to the lab window.",
                phonetic: "ee receipt lab coun-ter-ge ko-gon-di",
                native: "ಈ ರಿಸೀಟ್ ಲ್ಯಾಬ್ ಕೌಂಟರ್‍ಗೆ ಕೊಗೊಂಡಿ",
              },
            ],
          },
          {
            speaker: "user",
            english: "Thank you.",
            phonetic: "dhan-ya-va-da",
            native: "ಧನ್ಯವಾದ",
          },
          {
            speaker: "other",
            replies: [
              {
                english: "Welcome — next patient please.",
                phonetic: "swa-gata ma-tte pa-tient ba-n-ni",
                native: "ಸ್ವಾಗತ ಮತ್ತೆ ಪೇಷೆಂಟ್ ಬನ್ನಿ",
              },
            ],
          },
        ],
      },
      {
        phase: 4,
        title: "Pharmacy counter",
        other_label: "Pharmacist",
        other_emoji: "💊",
        turns: [
          {
            speaker: "user",
            english: "Sister, give these medicines from the prescription.",
            phonetic:
              "akka ee medi-sin-gal-annu prescription praka-ra ko-di",
            native: "ಅಕ್ಕ ಈ ಮೆಡಿಸಿನ್ಗಳನ್ನು ಪ್ರಿಸ್ಕ್ರಿಪ್ಶನ್ ಪ್ರಕಾರ ಕೊಡಿ",
          },
          {
            speaker: "other",
            replies: [
              {
                english: "Wait — let me check all items.",
                phonetic: "ka-yi-ri check ma-a-dte-ni",
                native: "ಕಾಯಿರಿ ಚೆಕ್ ಮಾಡ್ತೀನಿ",
              },
              {
                english: "This tablet is out of stock — same salt substitute ok?",
                phonetic: "ee tab-let illa ade salt sub-sti-tute seri-ya?",
                native: "ಈ ಟ್ಯಾಬ್ಲೆಟ್ ಇಲ್ಲ ಅದೆ ಸಾಲ್ಟ್ ಸಬ್ಸ್ಟಿಟ್ಯೂಟ್ ಸರಿಯಾ?",
              },
              {
                english: "Before food or after food — I will explain.",
                phonetic: "oo-ta mu-n-cha na-ntara hel-te-ni",
                native: "ಊಟ ಮುಂಚ ನಂತರ ಹೇಳ್ತೇನಿ",
              },
            ],
          },
          {
            speaker: "user",
            english: "Substitute is fine if the doctor allows.",
            phonetic: "sub-sti-tute seri doc-tor he-li-dare",
            native: "ಸಬ್ಸ್ಟಿಟ್ಯೂಟ್ ಸರಿ ಡಾಕ್ಟರ್ ಹೇಳಿದರೆ",
          },
          {
            speaker: "other",
            replies: [
              {
                english: "Then take this strip — after food at night.",
                phonetic: "aa-gal-ade ee strip oota mele raatri",
                native: "ಆಗಲಾದೆ ಈ ಸ್ಟ್ರಿಪ್ ಊಟ ಮೇಲೆ ರಾತ್ರಿ",
              },
              {
                english: "Read the dose on the cover.",
                phonetic: "cover me-le dose odi",
                native: "ಕವರ್ ಮೇಲೆ ಡೋಸ್ ಓದಿ",
              },
            ],
          },
          {
            speaker: "user",
            english: "What is the total?",
            phonetic: "total yeshtu?",
            native: "ಟೋಟಲ್ ಎಷ್ಟು?",
          },
          {
            speaker: "other",
            replies: [
              {
                english: "Two hundred and eighty rupees.",
                phonetic: "ee-ru noo-ru im-bat-thu roo-pa-yi",
                native: "ಎರಡು ನೂರು ಎಂಬತ್ತು ರೂಪಾಯಿ",
              },
              {
                english: "UPI is available here.",
                phonetic: "illiy-U-P-I idhe",
                native: "ಇಲ್ಲಿ ಯುಪಿಐ ಇದೆ",
              },
            ],
          },
          {
            speaker: "user",
            english: "Paid. Thank you.",
            phonetic: "pay aa-gide dhan-ya-va-da",
            native: "ಪೇ ಆಗಿದೆ ಧನ್ಯವಾದ",
          },
          {
            speaker: "other",
            replies: [
              {
                english: "Take care — get well soon.",
                phonetic: "ja-ka-ra-tte beg-a chen-na-gi a-g-li",
                native: "ಜಾಗರತೆ ಬೇಗ ಚೆನ್ನಾಗಿ ಆಗ್ಲಿ",
              },
            ],
          },
        ],
      },
    ],
  },
  {
    id: "bus-conductor",
    title: "On the bus",
    contextEnglish:
      "You board a city bus. The conductor walks the aisle for your stop and ticket.",
    other_label: "Conductor",
    other_emoji: "🚌",
    end_note: "You have your ticket and know your stop — ride until they call it.",
    turns: [
      {
        speaker: "user",
        english: "Anna, I need to go to Banashankari.",
        phonetic: "an-na nan-ge ban-na-shan-ka-ri-ge be-ku",
        native: "ಅಣ್ಣ, ನಂಗೆ ಬನ್ನಶಂಕರಿಗೆ ಬೇಕು",
      },
      {
        speaker: "other",
        replies: [
          {
            english: "Which stop in Banashankari?",
            phonetic: "ban-na-shan-ka-ri ya-va stop?",
            native: "ಬನ್ನಶಂಕರಿ ಯಾವ ಸ್ಟಾಪ್?",
          },
          {
            english: "Come inside — stand near the door.",
            phonetic: "olage ba-ni door hat-ra nill-i",
            native: "ಒಳಗೆ ಬನ್ನಿ ಡೋರ್ ಹತ್ತರ ನಿಲ್ಲಿ",
          },
          {
            english: "This bus goes that side — sit.",
            phonetic: "ee bus aa side hog-ut-te ku-lith-kol-li",
            native: "ಈ ಬಸ್ ಆ ಸೈಡ್ ಹೋಗುತ್ತೆ ಕುಳಿತ್ಕೊಳ್ಳಿ",
          },
        ],
      },
      {
        speaker: "user",
        english: "Metro station side is fine.",
        phonetic: "metro station hat-ra sa-ri",
        native: "ಮೆಟ್ರೋ ಸ್ಟೇಶನ್ ಹತ್ರ ಸರಿ",
      },
      {
        speaker: "other",
        replies: [
          {
            english: "Okay — ticket is thirty rupees.",
            phonetic: "seri ticket mu-vat-thu roo-pa-yi",
            native: "ಸರಿ ಟಿಕೆಟ್ ಮೂವತ್ತು ರೂಪಾಯಿ",
          },
          {
            english: "Forty rupees from here.",
            phonetic: "illinda nal-vat-thu roo-pa-yi",
            native: "ಇಲ್ಲಿಂದ ನಲ್ವತ್ತು ರೂಪಾಯಿ",
          },
          {
            english: "Student pass or full ticket?",
            phonetic: "student pass-a? full ticket-a?",
            native: "ಸ್ಟೂಡೆಂಟ್ ಪಾಸ್ಆ? ಫುಲ್ ಟಿಕೆಟ್ಆ?",
          },
        ],
      },
      {
        speaker: "user",
        english: "Full ticket. Here is fifty rupees.",
        phonetic: "full ticket idu aid-hu roo-pa-yi",
        native: "ಫುಲ್ ಟಿಕೆಟ್ ಇದು ಐವತ್ತು ರೂಪಾಯಿ",
      },
      {
        speaker: "other",
        replies: [
          {
            english: "No change — exact amount only.",
            phonetic: "change illa exact dud-du be-ku",
            native: "ಚೇಂಜ್ ಇಲ್ಲ ಎಕ್ಸಾಕ್ಟ್ ದುಡ್ಡು ಬೇಕು",
          },
          {
            english: "Take your ticket — keep till you get down.",
            phonetic: "ticket teg-on-di ir-ge ir-li",
            native: "ಟಿಕೆಟ್ ತೆಗೊಂಡಿ ಇರ್ಲಿ",
          },
          {
            english: "Ten rupees change — take it.",
            phonetic: "hattu roo-pa-yi change teg-on-di",
            native: "ಹತ್ತು ರೂಪಾಯಿ ಚೇಂಜ್ ತೆಗೊಂಡಿ",
          },
        ],
      },
      {
        speaker: "user",
        english: "Please tell me when my stop comes.",
        phonetic: "nan-ge stop band-re hel-teera?",
        native: "ನಂಗೆ ಸ್ಟಾಪ್ ಬಂದ್ರೆ ಹೇಳ್ತೀರಾ?",
      },
      {
        speaker: "other",
        replies: [
          {
            english: "I will call Banashankari — don’t worry.",
            phonetic: "ban-na-shan-ka-ri band-re hel-te-ni chinta beda",
            native: "ಬನ್ನಶಂಕರಿ ಬಂದ್ರೆ ಹೇಳ್ತೇನಿ ಚಿಂತೆ ಬೇಡ",
          },
          {
            english: "Two more stops — then yours.",
            phonetic: "e-ra-du stop na-ntara nim-du",
            native: "ಎರಡು ಸ್ಟಾಪ್ ನಂತರ ನಿಮ್ದು",
          },
        ],
      },
      {
        speaker: "user",
        english: "This is my stop — I am getting down.",
        phonetic: "ee nan-du stop na-nu ir-te-ni",
        native: "ಈ ನನ್ನ ಸ್ಟಾಪ್ ನಾನು ಇಳ್ತೇನಿ",
      },
      {
        speaker: "other",
        replies: [
          {
            english: "Okay — get down carefully.",
            phonetic: "seri ja-ka-ra-tte ir-i",
            native: "ಸರಿ ಜಾಗರತೆ ಇರಿ",
          },
          {
            english: "Move fast — bus is starting.",
            phonetic: "beg-a ir-i bus start a-gut-te",
            native: "ಬೇಗ ಇರಿ ಬಸ್ ಸ್ಟಾರ್ಟ್ ಆಗುತ್ತೆ",
          },
        ],
      },
    ],
  },
  {
    id: "medical-dolo",
    title: "At the medical shop",
    contextEnglish: "You need medicine (for example Dolo). The shopkeeper is at the counter.",
    other_label: "Shopkeeper",
    other_emoji: "💊",
    end_note: "You pay and leave with what you need.",
    turns: [
      {
        speaker: "user",
        english: "Anna, do you have Dolo?",
        phonetic: "an-na do-lo idhe-ya?",
        native: "ಅಣ್ಣ, ಡೋಲೊ ಇದೆಯಾ?",
      },
      {
        speaker: "other",
        replies: [
          {
            english: "Yes, we have.",
            phonetic: "idhe idhe",
            native: "ಇದೆ ಇದೆ",
          },
          {
            english: "Which one — 650 or 500?",
            phonetic: "ya-va-du? six-fifty-a? five-hundred-a?",
            native: "ಯಾವದು? ಸಿಕ್ಸ್ ಫಿಫ್ಟಿಯಾ? ಫೈವ್ ಹಂಡ್ರೆಡಾ?",
          },
          {
            english: "Out of stock today.",
            phonetic: "ee-vat-thu illa",
            native: "ಇವತ್ತು ಇಲ್ಲ",
          },
        ],
      },
      {
        speaker: "user",
        english: "Give me one strip.",
        phonetic: "on-du strip ko-di",
        native: "ಒಂದು ಸ್ಟ್ರಿಪ್ ಕೊಡಿ",
      },
      {
        speaker: "other",
        replies: [
          {
            english: "How many do you want?",
            phonetic: "yeshtu be-ku?",
            native: "ಎಷ್ಟು ಬೇಕು?",
          },
          {
            english: "Only one?",
            phonetic: "on-du-ne-a?",
            native: "ಒಂದೇನಾ?",
          },
        ],
      },
      {
        speaker: "user",
        english: "One is enough.",
        phonetic: "on-du sa-ri",
        native: "ಒಂದು ಸಾಕು",
      },
      {
        speaker: "other",
        replies: [
          {
            english: "Twenty rupees.",
            phonetic: "im-bat-thu roo-pa-yi",
            native: "ಇಪ್ಪತ್ತು ರೂಪಾಯಿ",
          },
          {
            english: "Thirty rupees.",
            phonetic: "mu-vat-thu roo-pa-yi",
            native: "ಮೂವತ್ತು ರೂಪಾಯಿ",
          },
        ],
      },
      {
        speaker: "user",
        english: "Here, take the money.",
        phonetic: "idi dud-du",
        native: "ಇದು ದುಡ್ಡು",
      },
      {
        speaker: "other",
        replies: [
          {
            english: "Okay, take this.",
            phonetic: "seri teg-on-di",
            native: "ಸರಿ ತೆಗೊಂಡಿ",
          },
          {
            english: "Thank you, come again.",
            phonetic: "dhan-ya-va-da ma-tte ba-n-ni",
            native: "ಧನ್ಯವಾದ ಮತ್ತೆ ಬನ್ನಿ",
          },
        ],
      },
    ],
  },
  // ── PG room hunt ────────────────────────────────────────────────────────
  {
    id: "pg-room-hunt",
    title: "Looking for a PG",
    contextEnglish:
      "You call or walk in to ask about a paying-guest room near your work or college.",
    other_label: "PG owner",
    other_emoji: "🏠",
    end_note: "You saw the room and agreed on rent — or said you will call back.",
    turns: [
      {
        speaker: "user",
        english: "Anna, is there a PG room free near here?",
        phonetic: "an-na, illi hat-ra P-G room idhe-ya?",
        native: "ಅಣ್ಣ, ಇಲ್ಲಿ ಹತ್ರ ಪಿಜಿ ರೂಮ್ ಇದೆಯಾ?",
      },
      {
        speaker: "other",
        replies: [
          {
            english: "Yes, one room is free.",
            phonetic: "hau-du, on-du room idhe",
            native: "ಹೌದು, ಒಂದು ರೂಮ್ ಇದೆ",
          },
          {
            english: "Single or sharing?",
            phonetic: "sin-gle-a? sha-ring-a?",
            native: "ಸಿಂಗಲ್ಆ? ಶೇರಿಂಗ್ಆ?",
          },
          {
            english: "No vacancy now.",
            phonetic: "ee-vat-thu jaaga illa",
            native: "ಈಗ ಜಾಗ ಇಲ್ಲ",
          },
        ],
      },
      {
        speaker: "user",
        english: "I need a single room. Is food included?",
        phonetic: "nan-ge sin-gle room be-ku. oo-ta sa-ha idhe-ya?",
        native: "ನಂಗೆ ಸಿಂಗಲ್ ರೂಮ್ ಬೇಕು. ಊಟ ಸಹ ಇದೆಯಾ?",
      },
      {
        speaker: "other",
        replies: [
          {
            english: "Food yes — veg only.",
            phonetic: "oo-ta idhe, veg ma-thra",
            native: "ಊಟ ಇದೆ, ವೆಜ್ ಮಾತ್ರ",
          },
          {
            english: "No food — kitchen you can use.",
            phonetic: "oo-ta illa, kit-chen use ma-a-di",
            native: "ಊಟ ಇಲ್ಲ, ಕಿಚನ್ ಯೂಸ್ ಮಾಡಿ",
          },
          {
            english: "Only sharing has food.",
            phonetic: "sha-ring-ge ma-thra oo-ta",
            native: "ಶೇರಿಂಗ್‌ಗೆ ಮಾತ್ರ ಊಟ",
          },
        ],
      },
      {
        speaker: "user",
        english: "How much is the rent per month?",
        phonetic: "ting-ga-lu rent yeshtu?",
        native: "ತಿಂಗಳು ರೆಂಟ್ ಎಷ್ಟು?",
      },
      {
        speaker: "other",
        replies: [
          {
            english: "Eight thousand per month.",
            phonetic: "en-tu sa-vi-ra roo-pa-yi",
            native: "ಎಂಟು ಸಾವಿರ ರೂಪಾಯಿ",
          },
          {
            english: "Ten thousand — deposit extra.",
            phonetic: "hat-tu sa-vi-ra, de-posit be-ra-la",
            native: "ಹತ್ತು ಸಾವಿರ, ಡಿಪಾಸಿಟ್ ಬೇರೆ",
          },
          {
            english: "Six plus maintenance.",
            phonetic: "a-ru sa-vi-ra, main-te-nans ja-asti",
            native: "ಆರು ಸಾವಿರ, ಮೇಂಟೆನೆನ್ಸ್ ಜಾಸ್ತಿ",
          },
        ],
      },
      {
        speaker: "user",
        english: "Can I see the room?",
        phonetic: "room nod-la?",
        native: "ರೂಮ್ ನೋಡ್ಲಾ?",
      },
      {
        speaker: "other",
        replies: [
          {
            english: "Come, I will show you.",
            phonetic: "ba-ni, tors-te-ni",
            native: "ಬನ್ನಿ, ತೋರ್ಸ್ತೇನಿ",
          },
          {
            english: "Evening only — people are inside.",
            phonetic: "san-je ma-thra, ol-ge jaa-na id-daare",
            native: "ಸಂಜೆ ಮಾತ್ರ, ಒಳಗೆ ಜನ ಇದ್ದಾರೆ",
          },
        ],
      },
      {
        speaker: "user",
        english: "Okay, I will take it. When can I shift?",
        phonetic: "seri, te-gon-du-ve. yaa-va-ga shift?",
        native: "ಸರಿ, ತೆಗೊಂಡ್ವೆ. ಯಾವಾಗ ಶಿಫ್ಟ್?",
      },
      {
        speaker: "other",
        replies: [
          {
            english: "Tomorrow is fine.",
            phonetic: "naa-le sa-ri",
            native: "ನಾಳೆ ಸರಿ",
          },
          {
            english: "Pay advance — then keys.",
            phonetic: "ad-vance pay ma-a-di, aa me-le key",
            native: "ಅಡ್ವಾನ್ಸ್ ಪೇ ಮಾಡಿ, ಆ ಮೇಲೆ ಕೀ",
          },
        ],
      },
    ],
  },

  // ── Kirana store ─────────────────────────────────────────────────────────
  {
    id: "kirana-store",
    title: "At the kirana store",
    contextEnglish:
      "Small neighbourhood shop — you need rice, oil, or daily items.",
    other_label: "Shopkeeper",
    other_emoji: "🛒",
    end_note: "You paid and left with your items.",
    turns: [
      {
        speaker: "user",
        english: "Anna, do you have Sona Masoori rice?",
        phonetic: "an-na, so-na ma-su-ri ak-ki idhe-ya?",
        native: "ಅಣ್ಣ, ಸೋನಾ ಮಸೂರಿ ಅಕ್ಕಿ ಇದೆಯಾ?",
      },
      {
        speaker: "other",
        replies: [
          {
            english: "Yes, we have.",
            phonetic: "idhe idhe",
            native: "ಇದೆ ಇದೆ",
          },
          {
            english: "Which bag — 5 kg or 10 kg?",
            phonetic: "ya-va bag? aid-hu kg-a? hat-tu kg-a?",
            native: "ಯಾವ ಬ್ಯಾಗ್? ಐದು ಕೆಜಿಯಾ? ಹತ್ತು ಕೆಜಿಯಾ?",
          },
          {
            english: "Finished today — come tomorrow.",
            phonetic: "ee-vat-thu mu-gi-de, naa-le ba-ni",
            native: "ಇವತ್ತು ಮುಗಿದೆ, ನಾಳೆ ಬನ್ನಿ",
          },
        ],
      },
      {
        speaker: "user",
        english: "Give me one 5 kg bag.",
        phonetic: "aid-hu kg on-du bag ko-di",
        native: "ಐದು ಕೆಜಿ ಒಂದು ಬ್ಯಾಗ್ ಕೊಡಿ",
      },
      {
        speaker: "other",
        replies: [
          {
            english: "Anything else?",
            phonetic: "be-re enu be-ku?",
            native: "ಬೇರೆ ಏನು ಬೇಕು?",
          },
          {
            english: "Only this?",
            phonetic: "id-duk-ke-na?",
            native: "ಇದ್ದುಕ್ಕೇನಾ?",
          },
        ],
      },
      {
        speaker: "user",
        english: "One litre Fortune oil also.",
        phonetic: "on-du li-tre en-ne, for-tune ko-di",
        native: "ಒಂದು ಲೀಟರ್ ಎಣ್ಣೆ, ಫಾರ್ಚ್ಯೂನ್ ಕೊಡಿ",
      },
      {
        speaker: "other",
        replies: [
          {
            english: "This bottle or smaller pouch?",
            phonetic: "ee bot-tle-a? chik-ka pouch-a?",
            native: "ಈ ಬಾಟಲ್ಆ? ಚಿಕ್ಕ ಪೌಚ್ಆ?",
          },
          {
            english: "Sunflower only today.",
            phonetic: "ee-vat-thu sun-flo-wer ma-thra",
            native: "ಇವತ್ತು ಸನ್‌ಫ್ಲವರ್ ಮಾತ್ರ",
          },
        ],
      },
      {
        speaker: "user",
        english: "This pouch is fine. What is the total?",
        phonetic: "ee pouch sa-ri. total yeshtu?",
        native: "ಈ ಪೌಚ್ ಸರಿ. ಟೋಟಲ್ ಎಷ್ಟು?",
      },
      {
        speaker: "other",
        replies: [
          {
            english: "Four hundred fifty rupees.",
            phonetic: "naa-noo-ra ai-vat-thu roo-pa-yi",
            native: "ನಾನೂರ ಐವತ್ತು ರೂಪಾಯಿ",
          },
          {
            english: "Five hundred rupees.",
            phonetic: "ai-dhu noo-ru roo-pa-yi",
            native: "ಐದು ನೂರು ರೂಪಾಯಿ",
          },
        ],
      },
      {
        speaker: "user",
        english: "I will pay by UPI.",
        phonetic: "U-P-I pay ma-a-dte-ni",
        native: "ಯುಪಿಐ ಪೇ ಮಾಡ್ತೀನಿ",
      },
      {
        speaker: "other",
        replies: [
          {
            english: "Scan here.",
            phonetic: "illi scan ma-a-di",
            native: "ಇಲ್ಲಿ ಸ್ಕ್ಯಾನ್ ಮಾಡಿ",
          },
          {
            english: "Cash only today — ATM is there.",
            phonetic: "ee-vat-thu cash ma-thra, A-T-M al-li",
            native: "ಇವತ್ತು ಕ್ಯಾಶ್ ಮಾತ್ರ, ಎಟಿಎಂ ಅಲ್ಲಿ",
          },
        ],
      },
      {
        speaker: "user",
        english: "Paid. Thank you, anna.",
        phonetic: "pay aa-gide. dhan-ya-va-da an-na",
        native: "ಪೇ ಆಗಿದೆ. ಧನ್ಯವಾದ ಅಣ್ಣ",
      },
      {
        speaker: "other",
        replies: [
          {
            english: "Okay, come again.",
            phonetic: "seri, ma-tte ba-ni",
            native: "ಸರಿ, ಮತ್ತೆ ಬನ್ನಿ",
          },
        ],
      },
    ],
  },
];

export function getSituationScriptById(
  id: string,
  languageCode: LanguageCode = "kn",
): StaticSituationScript | undefined {
  const base = STATIC_SITUATION_SCRIPTS.find((s) => s.id === id);
  if (!base) return undefined;
  return localizeSituationScript(base, languageCode, SITUATION_HI_LINES);
}
