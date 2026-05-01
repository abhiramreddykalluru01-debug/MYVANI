-- =========================================================================
-- VANI: Full Telugu phrase translations — all 98 phrases by UUID
-- Run AFTER migration_i18n.sql
-- Idempotent: safe to re-run (uses ON CONFLICT DO UPDATE)
-- =========================================================================

insert into public.phrase_translations
  (phrase_id, language_code, phonetic_text, native_text)
values
  -- ── Greetings ─────────────────────────────────────────────────────────
  ('d0b521e9-ebdd-43c2-ab00-4ef3c74bec27','te','Namaskaram','నమస్కారం'),
  ('9adab186-6115-48c7-9658-543138de07b6','te','Meeru ela unnaru?','మీరు ఎలా ఉన్నారు?'),
  ('5c618654-a6e6-454f-b094-c4f73bee4166','te','Nenu baagunnanu','నేను బాగున్నాను'),
  ('07da32b8-c38d-4fce-951f-8ab7d88b1b04','te','Dhanyavaadalu','ధన్యవాదాలు'),
  ('b87c233c-9456-4fe0-8eef-bd48c472e7c5','te','Naa peru [Name]','నా పేరు [Name]'),
  ('338f75bf-ce00-4dfa-938c-e48314201c7a','te','Nenu ee uuriki kaొttaga vacchanu','నేను ఈ ఊరికి కొత్తగా వచ్చాను'),
  ('3d1a0954-70b7-4c6a-acf6-202b826673de','te','Naku Kannada raadu','నాకు Kannada రాదు'),
  ('d795480a-989a-4c53-8e1f-1158b32d3cc1','te','Meeru ekkada pani chestaru?','మీరు ఎక్కడ పని చేస్తారు?'),
  ('645b9db4-fbc9-438b-9811-8019a6df8aff','te','Meeru mellaga maatladandi','మీరు మెల్లగా మాట్లాడండి'),
  ('84ad4ad2-eca2-48b2-a030-1e74244b017d','te','Kshaminchandi','క్షమించండి'),

  -- ── Food ──────────────────────────────────────────────────────────────
  ('8d2be93c-6157-4a39-b8c2-6cc8bf0f146d','te','Emii undii?','ఏమీ ఉంది?'),
  ('83b00e2f-e11a-4173-a8a7-8e72aa5ed987','te','Naku tindi kaavali','నాకు తిండి కావాలి'),
  ('1f76d40a-443b-44eb-b80e-31d6210d5c34','te','Naku neellu kaavali','నాకు నీళ్ళు కావాలి'),
  ('efcccd07-3c57-4ab6-b2b3-c0a80efb29dc','te','Oka plate kaavali','ఒక plate కావాలి'),
  ('538f3c13-703c-407b-86b6-83003d7047eb','te','Thakkuva kaaram peyyandi','తక్కువ కారం వేయండి'),
  ('1928dd8f-2f45-451c-915c-0ae9cd0967f5','te','Meeru daggara [item] undaa?','మీరు దగ్గర [item] ఉందా?'),
  ('34d183a9-c6ec-43af-ad82-792c76e8c557','te','Oka chai ivvandi','ఒక చాయ్ ఇవ్వండి'),
  ('4824fb62-007f-46ea-820e-85727b1d3365','te','Oka coffee ivvandi','ఒక coffee ఇవ్వండి'),
  ('704b97a9-e022-4ec4-b954-9fd120a79fdb','te','Idi entha?','ఇది ఎంత?'),
  ('881e570c-c326-416e-86ce-a0a658ac59d7','te','Tindi baagundi','తిండి బాగుంది'),

  -- ── Travel ────────────────────────────────────────────────────────────
  ('c7db1e34-9dca-4897-a87c-528f47c0841a','te','Ee jaaga ekkada undi?','ఈ జాగా ఎక్కడ ఉంది?'),
  ('1e86aa5b-e4c5-433f-83f6-6341d43f5419','te','Nenu ikkade vellaali','నేను ఇక్కడే వెళ్ళాలి'),
  ('5d27427d-2635-448f-8c29-e909552b9302','te','Meeru raagalara?','మీరు రాగలరా?'),
  ('ea1525c8-9309-4e5d-b91a-bd66b2c2ecef','te','Chadaa entha?','చాడా ఎంత?'),
  ('067a4e28-0487-41fa-a70d-cbc75259b1b7','te','NErugaa vellandi','నేరుగా వెళ్ళండి'),
  ('0766c263-2ab2-40e5-b7b6-db1611c794ee','te','Edamaki tirugandi','ఎడమకి తిరుగండి'),
  ('040b7f70-5f8a-4099-a2e9-b8a8654fa517','te','Kudi vaipuki tirugandi','కుడి వైపుకి తిరుగండి'),
  ('8f76851e-138a-4bbc-9ce4-11f9f8f05b01','te','Entha dooram undi?','ఎంత దూరం ఉంది?'),
  ('8d2be99a-d8ff-4beb-bc93-cfb5c6adc58d','te','Ikkade aapandi','ఇక్కడే ఆపండి'),
  ('2ed143f8-dbb5-4069-9105-040b43d0d979','te','Ikkade aagandi','ఇక్కడే ఆగండి'),

  -- ── Money / Payment ───────────────────────────────────────────────────
  ('82c54fcf-fc70-4edc-a57c-50cb1529d84b','te','Idi entha?','ఇది ఎంత?'),
  ('cf679717-eff2-411e-a583-4ce7ddec6668','te','Chaalaa merisina dhara','చాలా మెరిసిన ధర'),
  ('e7b6aa1e-22bd-4ae0-8b83-e41f3194e397','te','Koddiga thaggistaru?','కొద్దిగా తగ్గిస్తారు?'),
  ('69f97546-e8a0-4b7e-a984-80325720a4dc','te','Final dhara entha?','Final ధర ఎంత?'),
  ('3650b171-1fcc-4279-a138-a7288fac74dd','te','Enaina discount untundaa?','ఏమైనా discount ఉంటుందా?'),
  ('2c05d4cb-a209-4dd7-a8ae-1b05a51c82da','te','Naa daggara [amount] maatrame undi','నా దగ్గర [amount] మాత్రమే ఉంది'),
  ('792a776a-d210-4b67-bc49-0f48a9b0a15b','te','UPI lo cheyyavachaa?','UPI లో చేయవచ్చా?'),
  ('5604b6af-7ed3-433a-bcbf-2952cd84eddd','te','Card tho cheyyavachaa?','Card తో చేయవచ్చా?'),
  ('c85f01dd-b3ad-4f80-8a35-8c7cd3570c2a','te','Cash ivvavachaa?','Cash ఇవ్వవచ్చా?'),
  ('bf288d93-6278-40f7-a953-bc3a4fe4bf66','te','Meeru daggara change unda?','మీరు దగ్గర change ఉందా?'),
  ('d77319bf-d006-46bf-80ee-1e3790d71c54','te','Naa daggara change ledu','నా దగ్గర change లేదు'),
  ('680bb062-ac57-4ae8-a3fc-8c248bb87761','te','Bill ivvandi','Bill ఇవ్వండి'),

  -- ── Shopping ──────────────────────────────────────────────────────────
  ('a541f5d6-363a-4d9c-92e0-3d6431e38deb','te','Idi chupiyandi','ఇది చూపించండి'),
  ('1b7c4a87-27f0-431b-8a3c-217be83907fe','te','Naku idi kaavali','నాకు ఇది కావాలి'),
  ('6d44ecd2-e4ca-45a4-b618-05c86a617622','te','Peddha size unda?','పెద్ద size ఉందా?'),
  ('8d255594-711b-4c16-94af-ed9efcd0d472','te','Chinna size unda?','చిన్న size ఉందా?'),
  ('9cdec489-153b-43ee-b29e-26e90753bd78','te','Vere rangu unda?','వేరే రంగు ఉందా?'),
  ('a0ac3ba6-f606-4eaa-ae49-263b32fbbae1','te','Nenu idi try cheyyavachaa?','నేను ఇది try చేయవచ్చా?'),
  ('cddb0c67-d676-49f9-8e78-35a0df4eb9ea','te','Idi pack cheyyandi','ఇది pack చేయండి'),
  ('31eabb30-ab5f-4a87-9724-ded0123520ea','te','Nenu idi teesukuntaanu','నేను ఇది తీసుకుంటాను'),

  -- ── Groceries ─────────────────────────────────────────────────────────
  ('ca51695a-967b-4694-9f96-17d1774a1c72','te','Fresh kauraalu unnayaa?','Fresh కూరలు ఉన్నాయా?'),
  ('ac02ec95-bd28-4417-b695-890851b02d9c','te','Naku 1 kilo [item] kaavali','నాకు 1 కిలో [item] కావాలి'),
  ('57b7b6cf-5083-46b4-b755-1fc1d7377131','te','Ardha kilo ivvandi','అర్ధ కిలో ఇవ్వండి'),
  ('7e55739c-cb1d-4490-a694-9509dd14e147','te','Idi fresh ga undaa?','ఇది fresh గా ఉందా?'),
  ('a5723ab0-b280-4ef8-bc2f-d8424e9637e1','te','Manchii quality ivvandi','మంచి quality ఇవ్వండి'),
  ('545f78bc-e3ad-48a3-b9b4-79963f91f69b','te','Sariggaa kaayandi','సరిగ్గా కాయండి'),
  ('2b106335-dbba-40c6-ab59-3a23626bc546','te','Naku oka saanchaa kaavali','నాకు ఒక సంచా కావాలి'),
  ('ab06e5d1-a614-4840-8213-50a32eb35839','te','Chaalu idi','చాలు ఇది'),

  -- ── Need help / Emergency ─────────────────────────────────────────────
  ('50cea121-6445-4eac-a35d-7296bdf1881c','te','Naku sahaayam kaavali','నాకు సహాయం కావాలి'),
  ('1fd9f026-e64d-4faf-a98f-932f8ec247bd','te','Naku build ga ledu','నాకు బాగా లేదు'),
  ('ef4dc226-2c9e-41ea-94a7-ba91a8c9f63b','te','Aspathri ekkada undi?','ఆస్పత్రి ఎక్కడ ఉంది?'),
  ('fdbd375f-1f15-43a6-96a4-ebb79cdb64ed','te','Doctor ni pilavandi','డాక్టర్ని పిలవండి'),
  ('231c0f55-ed03-483e-8ac6-b4b542ba1f0e','te','Veganga randi','వేగంగా రండి'),
  ('6543a7eb-b4a6-4804-8a0f-565f5f14eed0','te','Medical shop ekkada undi?','Medical shop ఎక్కడ ఉంది?'),
  ('51052222-2a13-4ffc-a051-81717fa6b869','te','Nenu daaari taappipoyaanu','నేను దారి తప్పిపోయాను'),
  ('c6b0b806-19e1-498c-b00e-3ee50f26fb0d','te','Police ni pilavandi','పోలీసులని పిలవండి'),
  ('28db3c59-fd70-4a09-ab2f-f50718ff4aab','te','Meeru ki English artham avutundaa?','మీకు English అర్థం అవుతుందా?'),
  ('f8466bd8-925a-4449-9cde-f42a92acba74','te','Meeru mellaga maatladandi','మీరు మెల్లగా మాట్లాడండి'),

  -- ── Nurse ─────────────────────────────────────────────────────────────
  ('d7f1e916-9934-42b7-b257-02980bacc530','te','Ikkade koorchundi','ఇక్కడ కూర్చుండి'),
  ('d6bf78df-f764-47f0-9f7f-7492cf09ee12','te','Koddiga aagandi','కొద్దిగా ఆగండి'),
  ('7928632d-8b38-44ee-823c-9f25794a01dc','te','Meeru ki emii avutundi?','మీకు ఏమి అవుతుంది?'),
  ('f00b3eee-cb96-43b4-bb26-7e3be62c2bd2','te','Meeru ki jvaram unda?','మీకు జ్వరం ఉందా?'),
  ('023a1a52-acb2-4593-8324-70ead140794b','te','Meeru ki naoppi unda?','మీకు నొప్పి ఉందా?'),
  ('1d1e0924-67a2-4320-9612-f33d6c4e3fed','te','Nenu BP chustanu','నేను BP చూస్తాను'),
  ('1d13b6f7-0d47-4549-886d-6800ee42973b','te','Ee mandu teesukoni','ఈ మందు తీసుకోండి'),
  ('48e196f4-0838-473b-9f8d-61f34ca5bc9d','te','Naa venta randi','నా వెంట రండి'),
  ('63a54175-530c-460a-8aca-9c0f342a2070','te','Doctor vachestunnaru','డాక్టర్ వస్తున్నారు'),
  ('a99b9011-883f-4317-8062-4468970cd0bf','te','Emergency, veganga randi','Emergency, వేగంగా రండి'),

  -- ── Doctor ────────────────────────────────────────────────────────────
  ('f3c782b7-8701-45b1-9829-74990a6780b9','te','Meeru ki emii takleefu undi?','మీకు ఏమి తకలీఫు ఉంది?'),
  ('3c4dfb1f-9402-463c-815d-e96093ca4ecd','te','Idi eppatinundi undi?','ఇది ఎప్పటినుండి ఉంది?'),
  ('e775ecb2-32ea-48df-8a01-eca9626d9b24','te','Meeru ki enaina allergy unda?','మీకు ఏమైనా allergy ఉందా?'),
  ('26907829-1091-46a1-992b-ce093678941d','te','Nenu meeru ni examine chestanu','నేను మీరు ని examine చేస్తాను'),
  ('f8930f00-37bf-41c2-a7e4-ebc7f7f968e7','te','Meeru ki blood test kaavali','మీకు blood test కావాలి'),
  ('d0a4bcbe-a130-4cad-95a5-d8677a47d653','te','Ee mandu rojuku rendu sarlu teesukoni','ఈ మందు రోజుకి రెండు సార్లు తీసుకోండి'),
  ('67567ea3-dc2f-4f6f-850f-fe493e0be491','te','Bayapaddakandi','భయపడకండి'),
  ('755a1e83-ccd4-4add-a380-d1226bd0e35e','te','Meeru rest teesukovalsi undi','మీరు rest తీసుకోవాల్సి ఉంది'),
  ('2fb4679e-d896-48c0-8295-07c901028c80','te','Repu review ki randi','రేపు review కి రండి'),
  ('1493f0ca-c552-4d9f-9a8e-1b9058acdfee','te','Aspathri lo admit cheyyandi','ఆస్పత్రి లో admit చేయండి'),

  -- ── Software Engineer ─────────────────────────────────────────────────
  ('42450f68-248d-48e1-88a6-5ae101ef27aa','te','Meeting start cheddham','Meeting start చేద్దాం'),
  ('bd4287df-e8b5-4002-9d28-34e7e3721b89','te','Update share cheyyagalara?','Update share చేయగలరా?'),
  ('a808b416-da93-44e6-975b-2ff69fd4a25c','te','Ee issue check cheyyandi','ఈ issue check చేయండి'),
  ('d93332f3-3611-4cfc-b715-8d4be2243cb1','te','Idi blocked ga undi','ఇది blocked గా ఉంది'),
  ('7ab4eb5c-7d39-4444-84de-cda39ad690c1','te','Naku access kaavali','నాకు access కావాలి'),
  ('cb4a96ad-b1e5-4bb8-a156-a17d32b006b6','te','Nenu fix chesi update chestanu','నేను fix చేసి update చేస్తాను'),
  ('d6c16502-8e1d-4aa6-ac1f-52c8ab6919ab','te','Naa code review cheyyandi','నా code review చేయండి'),
  ('030ef57a-275e-4592-adcd-bbcd6ac5ade3','te','Nenu today deploy cheyyavachaa?','నేను today deploy చేయవచ్చా?'),
  ('853ead8f-7838-41aa-8d95-da6291aebb76','te','Naku inkaа time kaavali','నాకు ఇంకా time కావాలి'),
  ('63942906-9f3e-4edb-ae10-a1c1539ed23d','te','Paani puri ayindi','పని పూర్తి అయింది')

on conflict (phrase_id, language_code)
do update set
  phonetic_text = excluded.phonetic_text,
  native_text   = excluded.native_text;
