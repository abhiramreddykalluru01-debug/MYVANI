-- =========================================================================
-- VANI: Full Hindi phrase translations — all 95 phrases by UUID
-- Run AFTER migration_i18n.sql
-- Idempotent: safe to re-run (uses ON CONFLICT DO UPDATE)
-- =========================================================================

insert into public.phrase_translations
  (phrase_id, language_code, phonetic_text, native_text)
values
  -- ── Greetings ─────────────────────────────────────────────────────────
  ('d0b521e9-ebdd-43c2-ab00-4ef3c74bec27','hi','Namaste','नमस्ते'),
  ('9adab186-6115-48c7-9658-543138de07b6','hi','Aap kaise hain?','आप कैसे हैं?'),
  ('5c618654-a6e6-454f-b094-c4f73bee4166','hi','Main theek hoon','मैं ठीक हूँ'),
  ('07da32b8-c38d-4fce-951f-8ab7d88b1b04','hi','Dhanyavaad','धन्यवाद'),
  ('b87c233c-9456-4fe0-8eef-bd48c472e7c5','hi','Mera naam [Name] hai','मेरा नाम [Name] है'),
  ('338f75bf-ce00-4dfa-938c-e48314201c7a','hi','Main is shahar mein naya hoon','मैं इस शहर में नया हूँ'),
  ('3d1a0954-70b7-4c6a-acf6-202b826673de','hi','Mujhe Kannada nahi aati','मुझे Kannada नहीं आती'),
  ('d795480a-989a-4c53-8e1f-1158b32d3cc1','hi','Aap kahaan kaam karte hain?','आप कहाँ काम करते हैं?'),
  ('645b9db4-fbc9-438b-9811-8019a6df8aff','hi','Dheere boliye','धीरे बोलिए'),
  ('84ad4ad2-eca2-48b2-a030-1e74244b017d','hi','Maaf kijiye','माफ कीजिए'),

  -- ── Food ──────────────────────────────────────────────────────────────
  ('8d2be93c-6157-4a39-b8c2-6cc8bf0f146d','hi','Kya milega?','क्या मिलेगा?'),
  ('83b00e2f-e11a-4173-a8a7-8e72aa5ed987','hi','Mujhe khaana chahiye','मुझे खाना चाहिए'),
  ('1f76d40a-443b-44eb-b80e-31d6210d5c34','hi','Mujhe paani chahiye','मुझे पानी चाहिए'),
  ('efcccd07-3c57-4ab6-b2b3-c0a80efb29dc','hi','Ek plate chahiye','एक plate चाहिए'),
  ('538f3c13-703c-407b-86b6-83003d7047eb','hi','Thoda kam teekha karna','थोड़ा कम तीखा करना'),
  ('1928dd8f-2f45-451c-915c-0ae9cd0967f5','hi','Kya aapke paas [item] hai?','क्या आपके पास [item] है?'),
  ('34d183a9-c6ec-43af-ad82-792c76e8c557','hi','Ek chai dena','एक चाय देना'),
  ('4824fb62-007f-46ea-820e-85727b1d3365','hi','Ek coffee dena','एक coffee देना'),
  ('704b97a9-e022-4ec4-b954-9fd120a79fdb','hi','Yeh kitne ka hai?','यह कितने का है?'),
  ('881e570c-c326-416e-86ce-a0a658ac59d7','hi','Khaana achha hai','खाना अच्छा है'),

  -- ── Travel ────────────────────────────────────────────────────────────
  ('c7db1e34-9dca-4897-a87c-528f47c0841a','hi','Yeh jagah kahaan hai?','यह जगह कहाँ है?'),
  ('1e86aa5b-e4c5-433f-83f6-6341d43f5419','hi','Main yahaan jaana chahta hoon','मैं यहाँ जाना चाहता हूँ'),
  ('5d27427d-2635-448f-8c29-e909552b9302','hi','Kya aap aa sakte hain?','क्या आप आ सकते हैं?'),
  ('ea1525c8-9309-4e5d-b91a-bd66b2c2ecef','hi','Kiraya kitna hai?','किराया कितना है?'),
  ('067a4e28-0487-41fa-a70d-cbc75259b1b7','hi','Seedha jaiye','सीधा जाइए'),
  ('0766c263-2ab2-40e5-b7b6-db1611c794ee','hi','Baayen mudiye','बाएँ मुड़िए'),
  ('040b7f70-5f8a-4099-a2e9-b8a8654fa517','hi','Dahine mudiye','दाहिने मुड़िए'),
  ('8f76851e-138a-4bbc-9ce4-11f9f8f05b01','hi','Kitna door hai?','कितना दूर है?'),
  ('8d2be99a-d8ff-4beb-bc93-cfb5c6adc58d','hi','Yahaan rokna','यहाँ रोकना'),
  ('2ed143f8-dbb5-4069-9105-040b43d0d979','hi','Yahaan rukiye','यहाँ रुकिए'),

  -- ── Money / Payment ───────────────────────────────────────────────────
  ('82c54fcf-fc70-4edc-a57c-50cb1529d84b','hi','Yeh kitne ka hai?','यह कितने का है?'),
  ('cf679717-eff2-411e-a583-4ce7ddec6668','hi','Bahut mehnga hai','बहुत महंगा है'),
  ('e7b6aa1e-22bd-4ae0-8b83-e41f3194e397','hi','Thoda kam karo','थोड़ा कम करो'),
  ('69f97546-e8a0-4b7e-a984-80325720a4dc','hi','Aakhiri daam?','आखिरी दाम?'),
  ('3650b171-1fcc-4279-a138-a7288fac74dd','hi','Koi discount milega?','कोई discount मिलेगा?'),
  ('2c05d4cb-a209-4dd7-a8ae-1b05a51c82da','hi','Mere paas sirf [amount] hai','मेरे पास सिर्फ [amount] है'),
  ('792a776a-d210-4b67-bc49-0f48a9b0a15b','hi','Kya UPI se de sakta hoon?','क्या UPI से दे सकता हूँ?'),
  ('5604b6af-7ed3-433a-bcbf-2952cd84eddd','hi','Kya card se payment kar sakta hoon?','क्या card से payment कर सकता हूँ?'),
  ('c85f01dd-b3ad-4f80-8a35-8c7cd3570c2a','hi','Kya cash de sakta hoon?','क्या cash दे सकता हूँ?'),
  ('bf288d93-6278-40f7-a953-bc3a4fe4bf66','hi','Kya chhutta hai?','क्या छुट्टा है?'),
  ('d77319bf-d006-46bf-80ee-1e3790d71c54','hi','Mere paas chhutta nahi hai','मेरे पास छुट्टा नहीं है'),
  ('680bb062-ac57-4ae8-a3fc-8c248bb87761','hi','Bill dena','बिल देना'),

  -- ── Shopping ──────────────────────────────────────────────────────────
  ('a541f5d6-363a-4d9c-92e0-3d6431e38deb','hi','Yeh dikhaiye','यह दिखाइए'),
  ('1b7c4a87-27f0-431b-8a3c-217be83907fe','hi','Mujhe yeh chahiye','मुझे यह चाहिए'),
  ('6d44ecd2-e4ca-45a4-b618-05c86a617622','hi','Kya bada size hai?','क्या बड़ा size है?'),
  ('8d255594-711b-4c16-94af-ed9efcd0d472','hi','Kya chota size hai?','क्या छोटा size है?'),
  ('9cdec489-153b-43ee-b29e-26e90753bd78','hi','Kya doosra rang hai?','क्या दूसरा रंग है?'),
  ('a0ac3ba6-f606-4eaa-ae49-263b32fbbae1','hi','Kya main yeh try kar sakta hoon?','क्या मैं यह try कर सकता हूँ?'),
  ('cddb0c67-d676-49f9-8e78-35a0df4eb9ea','hi','Yeh pack karo','यह pack करो'),
  ('31eabb30-ab5f-4a87-9724-ded0123520ea','hi','Main yeh le loonga','मैं यह ले लूँगा'),

  -- ── Groceries ─────────────────────────────────────────────────────────
  ('ca51695a-967b-4694-9f96-17d1774a1c72','hi','Kya taaze sabzi hain?','क्या ताज़ी सब्ज़ी हैं?'),
  ('ac02ec95-bd28-4417-b695-890851b02d9c','hi','Mujhe 1 kilo [item] chahiye','मुझे 1 किलो [item] चाहिए'),
  ('57b7b6cf-5083-46b4-b755-1fc1d7377131','hi','Aadha kilo dena','आधा किलो देना'),
  ('7e55739c-cb1d-4490-a694-9509dd14e147','hi','Kya yeh taaza hai?','क्या यह ताज़ा है?'),
  ('a5723ab0-b280-4ef8-bc2f-d8424e9637e1','hi','Achhi quality dena','अच्छी quality देना'),
  ('545f78bc-e3ad-48a3-b9b4-79963f91f69b','hi','Sahi se wazan karo','सही से वज़न करो'),
  ('2b106335-dbba-40c6-ab59-3a23626bc546','hi','Mujhe ek theli chahiye','मुझे एक थैली चाहिए'),
  ('ab06e5d1-a614-4840-8213-50a32eb35839','hi','Bas itna kaafi hai','बस इतना काफी है'),

  -- ── Need help / Emergency ─────────────────────────────────────────────
  ('50cea121-6445-4eac-a35d-7296bdf1881c','hi','Mujhe madad chahiye','मुझे मदद चाहिए'),
  ('1fd9f026-e64d-4faf-a98f-932f8ec247bd','hi','Main theek nahi hoon','मैं ठीक नहीं हूँ'),
  ('ef4dc226-2c9e-41ea-94a7-ba91a8c9f63b','hi','Aspatal kahaan hai?','अस्पताल कहाँ है?'),
  ('fdbd375f-1f15-43a6-96a4-ebb79cdb64ed','hi','Doctor ko bulao','डॉक्टर को बुलाओ'),
  ('231c0f55-ed03-483e-8ac6-b4b542ba1f0e','hi','Jaldi aiye','जल्दी आइए'),
  ('6543a7eb-b4a6-4804-8a0f-565f5f14eed0','hi','Dawaayi ki dukaan kahaan hai?','दवाई की दुकान कहाँ है?'),
  ('51052222-2a13-4ffc-a051-81717fa6b869','hi','Main raasta bhool gaya','मैं रास्ता भूल गया'),
  ('c6b0b806-19e1-498c-b00e-3ee50f26fb0d','hi','Police ko bulao','पुलिस को बुलाओ'),
  ('28db3c59-fd70-4a09-ab2f-f50718ff4aab','hi','Kya aapko English aati hai?','क्या आपको English आती है?'),
  ('f8466bd8-925a-4449-9cde-f42a92acba74','hi','Dheere boliye','धीरे बोलिए'),

  -- ── Nurse / Doctor ────────────────────────────────────────────────────
  ('d7f1e916-9934-42b7-b257-02980bacc530','hi','Yahaan baitho','यहाँ बैठो'),
  ('d6bf78df-f764-47f0-9f7f-7492cf09ee12','hi','Thoda intezaar karo','थोड़ा इंतज़ार करो'),
  ('7928632d-8b38-44ee-823c-9f25794a01dc','hi','Aapko kya taklif hai?','आपको क्या तकलीफ है?'),
  ('f00b3eee-cb96-43b4-bb26-7e3be62c2bd2','hi','Kya aapko bukhar hai?','क्या आपको बुखार है?'),
  ('023a1a52-acb2-4593-8324-70ead140794b','hi','Kya aapko dard hai?','क्या आपको दर्द है?'),
  ('1d1e0924-67a2-4320-9612-f33d6c4e3fed','hi','Main BP check karoonga','मैं BP check करूँगा'),
  ('1d13b6f7-0d47-4549-886d-6800ee42973b','hi','Yeh dawaai lijiye','यह दवाई लीजिए'),
  ('48e196f4-0838-473b-9f8d-61f34ca5bc9d','hi','Mere saath aiye','मेरे साथ आइए'),
  ('63a54175-530c-460a-8aca-9c0f342a2070','hi','Doctor abhi aate hain','Doctor अभी आते हैं'),
  ('a99b9011-883f-4317-8062-4468970cd0bf','hi','Emergency hai, jaldi aao','Emergency है, जल्दी आओ'),
  ('f3c782b7-8701-45b1-9829-74990a6780b9','hi','Aapko kya takleef hai?','आपको क्या तकलीफ है?'),
  ('3c4dfb1f-9402-463c-815d-e96093ca4ecd','hi','Yeh kab se hai?','यह कब से है?'),
  ('e775ecb2-32ea-48df-8a01-eca9626d9b24','hi','Kya aapko koi allergy hai?','क्या आपको कोई allergy है?'),
  ('26907829-1091-46a1-992b-ce093678941d','hi','Main aapko dekhta hoon','मैं आपको देखता हूँ'),
  ('f8930f00-37bf-41c2-a7e4-ebc7f7f968e7','hi','Aapko blood test karwana hai','आपको blood test करवाना है'),
  ('d0a4bcbe-a130-4cad-95a5-d8677a47d653','hi','Yeh dawaai din mein do baar lena','यह दवाई दिन में दो बार लेना'),
  ('67567ea3-dc2f-4f6f-850f-fe493e0be491','hi','Chinta mat karo','चिंता मत करो'),
  ('755a1e83-ccd4-4add-a380-d1226bd0e35e','hi','Aapko aaram chahiye','आपको आराम चाहिए'),
  ('2fb4679e-d896-48c0-8295-07c901028c80','hi','Kal review ke liye aaiye','कल review के लिए आइए'),
  ('1493f0ca-c552-4d9f-9a8e-1b9058acdfee','hi','Aspatal mein admit karo','अस्पताल में admit करो'),

  -- ── Software Engineer ─────────────────────────────────────────────────
  ('42450f68-248d-48e1-88a6-5ae101ef27aa','hi','Meeting shuru karte hain','Meeting शुरू करते हैं'),
  ('bd4287df-e8b5-4002-9d28-34e7e3721b89','hi','Update share kar sakte ho?','Update share कर सकते हो?'),
  ('a808b416-da93-44e6-975b-2ff69fd4a25c','hi','Yeh issue check karo','यह issue check करो'),
  ('d93332f3-3611-4cfc-b715-8d4be2243cb1','hi','Yeh blocked hai','यह blocked है'),
  ('7ab4eb5c-7d39-4444-84de-cda39ad690c1','hi','Mujhe access chahiye','मुझे access चाहिए'),
  ('cb4a96ad-b1e5-4bb8-a156-a17d32b006b6','hi','Main theek karke update karta hoon','मैं ठीक करके update करता हूँ'),
  ('d6c16502-8e1d-4aa6-ac1f-52c8ab6919ab','hi','Mera code review karo','मेरा code review करो'),
  ('030ef57a-275e-4592-adcd-bbcd6ac5ade3','hi','Kya aaj deploy kar sakte hain?','क्या आज deploy कर सकते हैं?'),
  ('853ead8f-7838-41aa-8d95-da6291aebb76','hi','Mujhe aur waqt chahiye','मुझे और वक्त चाहिए'),
  ('63942906-9f3e-4edb-ae10-a1c1539ed23d','hi','Kaam ho gaya','काम हो गया')

on conflict (phrase_id, language_code)
do update set
  phonetic_text = excluded.phonetic_text,
  native_text   = excluded.native_text;
