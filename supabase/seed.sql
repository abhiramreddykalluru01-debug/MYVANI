-- Optional dev seed — run AFTER schema.sql.
-- Safe to re-run: wipes phrases/replies/categories first.

truncate public.replies, public.phrases, public.categories restart identity cascade;

-- ─── categories ──────────────────────────────────────────────────────────
insert into public.categories (type, slug, title, profession_key, sort_order) values
  ('general',      'greetings',   'Greetings',    null, 1),
  ('general',      'food',        'Food',         null, 2),
  ('general',      'travel',      'Travel',       null, 3),
  ('general',      'shopping',    'Shopping',     null, 4),
  ('quick_help',   'need_help',   'Need help',    null, 1),
  ('quick_help',   'emergency',   'Emergency',    null, 2),
  ('professional', 'teacher',     'Teacher',      'Teacher',           1),
  ('professional', 'engineer',    'Software Engineer', 'Software Engineer', 2),
  ('professional', 'healthcare',  'Healthcare',   'Healthcare',        3),
  ('professional', 'business',    'Business',     'Business',          4),
  ('professional', 'student',     'Student',      'Student',           5);

-- ─── demo phrases + replies (Kannada samples; swap for real content later) ──
do $$
declare
  greetings_id    uuid;
  food_id         uuid;
  travel_id       uuid;
  need_help_id    uuid;
  emergency_id    uuid;
  teacher_id      uuid;
  p uuid;
begin
  select id into greetings_id  from public.categories where type='general'    and slug='greetings';
  select id into food_id       from public.categories where type='general'    and slug='food';
  select id into travel_id     from public.categories where type='general'    and slug='travel';
  select id into need_help_id  from public.categories where type='quick_help' and slug='need_help';
  select id into emergency_id  from public.categories where type='quick_help' and slug='emergency';
  select id into teacher_id    from public.categories where type='professional' and slug='teacher';

  -- ── Greetings ────────────────────────────────────────────────────────
  insert into public.phrases (category_id, english_text, phonetic_text, native_text, answer_mode, sort_order)
    values (greetings_id, 'Hello', 'Namaskara', 'ನಮಸ್ಕಾರ', 'normal', 1)
    returning id into p;
  insert into public.replies (phrase_id, english_text, phonetic_text, native_text, reply_kind, sort_order) values
    (p, 'Hello',        'Namaskara',        'ನಮಸ್ಕಾರ',       'normal', 1),
    (p, 'How are you?', 'Hegiddiraa?',      'ಹೇಗಿದ್ದೀರಾ?',    'normal', 2),
    (p, 'Good, and you?', 'Chennagiddini, neevu?', 'ಚೆನ್ನಾಗಿದ್ದೀನಿ, ನೀವು?', 'normal', 3);

  insert into public.phrases (category_id, english_text, phonetic_text, native_text, answer_mode, sort_order)
    values (greetings_id, 'Thank you', 'Dhanyavaadagalu', 'ಧನ್ಯವಾದಗಳು', 'normal', 2)
    returning id into p;
  insert into public.replies (phrase_id, english_text, phonetic_text, native_text, reply_kind, sort_order) values
    (p, 'You are welcome', 'Pharvaagilla',     'ಪರವಾಗಿಲ್ಲ',   'normal', 1),
    (p, 'No problem',      'Tondre illa',      'ತೊಂದರೆ ಇಲ್ಲ',  'normal', 2),
    (p, 'Anytime',         'Yaavaaglu',        'ಯಾವಾಗಲೂ',     'normal', 3);

  -- ── Food (yes/no example) ────────────────────────────────────────────
  insert into public.phrases (category_id, english_text, phonetic_text, native_text, answer_mode, sort_order)
    values (food_id, 'Do you have water?', 'Neevu neeru ideyaa?', 'ನೀವು ನೀರು ಇದೆಯಾ?', 'yes_no', 1)
    returning id into p;
  insert into public.replies (phrase_id, english_text, phonetic_text, native_text, reply_kind, sort_order) values
    (p, 'Yes, here it is',     'Houdu, illi ide',   'ಹೌದು, ಇಲ್ಲಿ ಇದೆ',   'yes',    1),
    (p, 'No, sorry',           'Illa, kshamisi',    'ಇಲ್ಲ, ಕ್ಷಮಿಸಿ',    'no',     2),
    (p, 'One minute please',   'Ondu nimisha',      'ಒಂದು ನಿಮಿಷ',       'normal', 3);

  -- ── Travel ───────────────────────────────────────────────────────────
  insert into public.phrases (category_id, english_text, phonetic_text, native_text, answer_mode, sort_order)
    values (travel_id, 'Where is the bus stand?', 'Bus stand elli ide?', 'ಬಸ್ ಸ್ಟ್ಯಾಂಡ್ ಎಲ್ಲಿ ಇದೆ?', 'normal', 1)
    returning id into p;
  insert into public.replies (phrase_id, english_text, phonetic_text, native_text, reply_kind, sort_order) values
    (p, 'Go straight',         'Mundakke hogi',     'ಮುಂದಕ್ಕೆ ಹೋಗಿ',   'normal', 1),
    (p, 'Turn left',            'Edagadege hogi',    'ಎಡಗಡೆಗೆ ಹೋಗಿ',   'normal', 2),
    (p, 'It is nearby',         'Paksha ide',        'ಪಕ್ಕದಲ್ಲಿ ಇದೆ',    'normal', 3);

  -- ── Need help ────────────────────────────────────────────────────────
  insert into public.phrases (category_id, english_text, phonetic_text, native_text, answer_mode, sort_order)
    values (need_help_id, 'I need help.', 'Nanage help beku.', 'ನನಗೆ help ಬೇಕು.', 'normal', 1)
    returning id into p;
  insert into public.replies (phrase_id, english_text, phonetic_text, native_text, reply_kind, sort_order) values
    (p, 'What happened?',       'Yenagide?',          'ಏನಾಗಿದೆ?',         'normal', 1),
    (p, 'I will help',          'Naanu help madtini', 'ನಾನು help ಮಾಡ್ತೀನಿ', 'normal', 2),
    (p, 'Wait a moment',        'Ondu nimisha irri',  'ಒಂದು ನಿಮಿಷ ಇರಿ',   'normal', 3);

  -- ── Emergency ────────────────────────────────────────────────────────
  insert into public.phrases (category_id, english_text, phonetic_text, native_text, answer_mode, sort_order)
    values (emergency_id, 'Call the police.', 'Police-ge call maadi.', 'Police-ಗೆ call ಮಾಡಿ.', 'normal', 1)
    returning id into p;
  insert into public.replies (phrase_id, english_text, phonetic_text, native_text, reply_kind, sort_order) values
    (p, 'Okay, calling',        'Sari, call maadtini', 'ಸರಿ, call ಮಾಡ್ತೀನಿ', 'normal', 1),
    (p, 'What happened?',       'Yenagide?',           'ಏನಾಗಿದೆ?',         'normal', 2),
    (p, 'Stay calm',            'Shaantavagirri',      'ಶಾಂತವಾಗಿರಿ',       'normal', 3);

  -- ── Teacher (professional) ───────────────────────────────────────────
  insert into public.phrases (category_id, english_text, phonetic_text, native_text, answer_mode, sort_order)
    values (teacher_id, 'Class begins', 'Class shuru aagide', 'ತರಗತಿ ಶುರುವಾಗಿದೆ', 'normal', 1)
    returning id into p;
  insert into public.replies (phrase_id, english_text, phonetic_text, native_text, reply_kind, sort_order) values
    (p, 'Okay teacher',         'Sari sir',          'ಸರಿ sir',          'normal', 1),
    (p, 'One minute',            'Ondu nimisha',      'ಒಂದು ನಿಮಿಷ',        'normal', 2),
    (p, 'Coming',                'Barta iddini',      'ಬರ್ತಾ ಇದ್ದೀನಿ',    'normal', 3);
end $$;
