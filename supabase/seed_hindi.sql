-- =========================================================================
-- VANI Hindi seed — adds Hindi translations for existing phrases.
-- Run AFTER migration_i18n.sql.
--
-- Strategy: matches existing rows by english_text and inserts a Hindi
-- translation only if one doesn't already exist (idempotent).
-- =========================================================================

do $$
declare
  rec record;
begin
  -- Phrase translations: english_text -> (phonetic_hi, native_hi)
  for rec in
    select * from (values
      -- ── Greetings ─────────────────────────────────────────────────────
      ('Hello',                'Namaste',                   'नमस्ते'),
      ('Hi',                   'Namaste',                   'नमस्ते'),
      ('Bye',                  'Alvida',                    'अलविदा'),
      ('Thank you',            'Dhanyavaad',                'धन्यवाद'),
      ('Sorry',                'Maaf kijiye',               'माफ कीजिए'),
      ('Please',               'Kripaya',                   'कृपया'),
      ('Yes',                  'Haan',                      'हाँ'),
      ('No',                   'Nahi',                      'नहीं'),
      ('Excuse me',            'Sun-iye',                   'सुनिए'),
      ('Good morning',         'Suprabhaat',                'सुप्रभात'),

      -- ── Food ──────────────────────────────────────────────────────────
      ('Do you have water?',   'Aapke paas paani hai?',     'आपके पास पानी है?'),
      ('What is available?',   'Kya milega?',               'क्या मिलेगा?'),
      ('I want food',          'Mujhe khaana chahiye',      'मुझे खाना चाहिए'),
      ('I want water',         'Mujhe paani chahiye',       'मुझे पानी चाहिए'),
      ('I want tea',           'Mujhe chai chahiye',        'मुझे चाय चाहिए'),
      ('The food is good',     'Khaana achha hai',          'खाना अच्छा है'),

      -- ── Travel ────────────────────────────────────────────────────────
      ('Where is the bus stand?', 'Bus stand kahaan hai?',  'बस स्टैंड कहाँ है?'),
      ('Where is this place?',    'Yeh jagah kahaan hai?',  'यह जगह कहाँ है?'),
      ('How far is it?',          'Kitna door hai?',        'कितना दूर है?'),
      ('I am lost',               'Main raasta bhool gaya', 'मैं रास्ता भूल गया'),

      -- ── Money / Payment ───────────────────────────────────────────────
      ('How much is this?',    'Yeh kitne ka hai?',         'यह कितने का है?'),
      ('How much?',            'Kitna?',                    'कितना?'),
      ('Too expensive',        'Bahut mehnga hai',          'बहुत महंगा है'),
      ('No change',            'Chhutta nahi hai',          'छुट्टा नहीं है'),

      -- ── Shopping ──────────────────────────────────────────────────────
      ('Show me',              'Dikhaiye',                  'दिखाइए'),
      ('I will take this',     'Yeh le-loonga',             'यह ले लूँगा'),
      ('I do not want this',   'Yeh nahi chahiye',          'यह नहीं चाहिए'),

      -- ── Need help ─────────────────────────────────────────────────────
      ('I need help.',         'Mujhe madad chahiye',       'मुझे मदद चाहिए'),
      ('I need help',          'Mujhe madad chahiye',       'मुझे मदद चाहिए'),
      ('Please help me',       'Kripaya madad kijiye',      'कृपया मदद कीजिए'),
      ('I do not understand',  'Mujhe samajh nahi aaya',    'मुझे समझ नहीं आया'),
      ('Please speak slowly',  'Dheere bolo',               'धीरे बोलो'),

      -- ── Emergency ─────────────────────────────────────────────────────
      ('Call the police.',     'Police ko bulao',           'पुलिस को बुलाओ'),
      ('Call an ambulance',    'Ambulance bulao',           'एम्बुलेंस बुलाओ'),
      ('I am hurt',            'Mujhe chot lagi hai',       'मुझे चोट लगी है'),
      ('Where is the hospital?', 'Aspatal kahaan hai?',     'अस्पताल कहाँ है?'),

      -- ── Teacher ───────────────────────────────────────────────────────
      ('Class begins',         'Class shuru ho gayi',       'क्लास शुरू हो गई')
    ) as t(en, ph, na)
  loop
    insert into public.phrase_translations
      (phrase_id, language_code, phonetic_text, native_text)
    select p.id, 'hi', rec.ph, rec.na
    from public.phrases p
    where p.english_text = rec.en
      and not exists (
        select 1 from public.phrase_translations
         where phrase_id = p.id and language_code = 'hi'
      );
  end loop;
end $$;

-- ── Reply translations ─────────────────────────────────────────────────────
do $$
declare
  rec record;
begin
  for rec in
    select * from (values
      ('Hello',                'Namaste',                   'नमस्ते'),
      ('How are you?',         'Aap kaise hain?',           'आप कैसे हैं?'),
      ('Good, and you?',       'Achha, aur aap?',           'अच्छा, और आप?'),
      ('You are welcome',      'Koi baat nahi',             'कोई बात नहीं'),
      ('No problem',           'Koi problem nahi',          'कोई प्रॉब्लम नहीं'),
      ('Anytime',              'Kabhi bhi',                 'कभी भी'),
      ('Yes, here it is',      'Haan, yeh raha',            'हाँ, यह रहा'),
      ('No, sorry',            'Nahi, maaf kijiye',         'नहीं, माफ कीजिए'),
      ('One minute please',    'Ek minute',                 'एक मिनट'),
      ('Go straight',          'Seedha jaiye',              'सीधा जाइए'),
      ('Turn left',            'Baayen mudiye',             'बाएँ मुड़िए'),
      ('It is nearby',         'Paas mein hai',             'पास में है'),
      ('What happened?',       'Kya hua?',                  'क्या हुआ?'),
      ('I will help',          'Main madad karoonga',       'मैं मदद करूँगा'),
      ('Wait a moment',        'Ek minute rukiye',          'एक मिनट रुकिए'),
      ('Okay, calling',        'Theek hai, bula raha hoon', 'ठीक है, बुला रहा हूँ'),
      ('Stay calm',            'Shaant rahiye',             'शांत रहिए'),
      ('Okay teacher',         'Theek hai sir',             'ठीक है sir'),
      ('Coming',                'Aa raha hoon',             'आ रहा हूँ')
    ) as t(en, ph, na)
  loop
    insert into public.reply_translations
      (reply_id, language_code, phonetic_text, native_text)
    select r.id, 'hi', rec.ph, rec.na
    from public.replies r
    where r.english_text = rec.en
      and not exists (
        select 1 from public.reply_translations
         where reply_id = r.id and language_code = 'hi'
      );
  end loop;
end $$;

-- =========================================================================
-- Done. Hindi translations added to all matching existing phrases/replies.
-- Run `npm run audio:generate -- --language hi --include-replies` to make
-- audio for them.
-- =========================================================================
