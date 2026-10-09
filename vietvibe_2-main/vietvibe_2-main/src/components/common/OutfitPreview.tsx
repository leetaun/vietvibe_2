import React, { useId } from 'react';
import { CULTURAL_COSTUMES } from '../../data/mockData';
import { OutfitComponentSelection } from '../../types/vietvibe';

interface OutfitPreviewProps {
  costumeId: string;
  outfit: OutfitComponentSelection;
}

/** All wardrobe pieces share the same mannequin coordinates and layer order. */
export const OutfitPreview: React.FC<OutfitPreviewProps> = ({ costumeId, outfit }) => {
  const id = useId().replace(/:/g, '');
  const costume = CULTURAL_COSTUMES.find(item => item.id === costumeId);
  const style = costume?.style;
  const nhatBinh = style === 'Nhật bình';
  const crossCollar = style === 'Giao lĩnh';
  const openRobe = style === 'Tứ thân';
  const roundCollar = style === 'Viên lĩnh';
  const longDress = ['Áo dài', 'Lê Phổ', 'Cổ thuyền', 'Raglan'].includes(style || '');
  const wideSleeves = nhatBinh || style === 'Áo tấc' || crossCollar || roundCollar;
  const puffSleeves = style === 'Lê Phổ';
  const has = (accessory: string) => outfit.accessories.includes(accessory);
  const innerColor = outfit.innerRobe === 'Áo lót xanh' ? '#9CBEC2' : outfit.innerRobe === 'Áo lót kem' ? '#E8D9BB' : '#FAF7EE';
  const pantsColor = outfit.pantsOrSkirt === 'Quần lụa đen' ? '#303439' : '#E9E7DF';
  const skirt = outfit.pantsOrSkirt === 'Váy lụa';
  const sneakers = outfit.footwear === 'Giày thể thao Sneaker';
  const clogs = outfit.footwear === 'Guốc mộc';
  const barefoot = outfit.footwear === 'Không dùng';
  const headwrap = outfit.headwear !== 'Không dùng';
  const headColor = outfit.headwear === 'Mấn đỏ' ? '#87382E' : outfit.headwear === 'Khăn đóng' ? '#292D2B' : '#224E63';
  const body = longDress
    ? 'M149 163 Q180 156 211 163 L209 209 Q199 232 213 264 L238 420 Q212 431 184 417 L180 250 L176 417 Q148 431 122 420 L147 264 Q161 232 151 209 Z'
    : openRobe
      ? 'M145 161 Q180 158 215 161 L230 391 Q208 407 192 401 L180 248 L168 401 Q145 407 130 391 Z'
      : 'M146 162 Q180 156 214 162 L234 397 Q180 418 126 397 Z';
  const leftSleeve = wideSleeves
    ? 'M149 162 Q125 164 112 184 L68 281 Q82 302 121 308 L150 217 Z'
    : puffSleeves
      ? 'M149 162 C123 152 109 184 119 204 L113 271 L137 278 L158 205 Z'
      : 'M149 163 Q132 166 124 184 L105 281 L130 288 L158 208 Z';
  const rightSleeve = wideSleeves
    ? 'M211 162 Q235 164 248 184 L292 281 Q278 302 239 308 L210 217 Z'
    : puffSleeves
      ? 'M211 162 C237 152 251 184 241 204 L247 271 L223 278 L202 205 Z'
      : 'M211 163 Q228 166 236 184 L255 281 L230 288 L202 208 Z';
  const url = (name: string) => `url(#${id}-${name})`;

  return <svg className="vv-outfit-mannequin" viewBox="0 0 360 540" role="img" aria-label={`Bản phối minh họa ${outfit.mainGarment}, ${outfit.innerRobe}, ${outfit.pantsOrSkirt}, ${outfit.headwear}, ${outfit.footwear}`}>
    <defs>
      <linearGradient id={`${id}-body`} x1="0" y1="0" x2="1" y2="0"><stop stopColor="#B5B7AA" /><stop offset=".45" stopColor="#F1EFE5" /><stop offset="1" stopColor="#BCBFB1" /></linearGradient>
      <linearGradient id={`${id}-silk`} x1="0" y1="0" x2="1" y2="0"><stop stopColor={outfit.colorTheme} /><stop offset=".45" stopColor={outfit.colorTheme} /><stop offset=".65" stopColor={outfit.colorTheme} stopOpacity=".8" /><stop offset="1" stopColor={outfit.colorTheme} /></linearGradient>
      <linearGradient id={`${id}-gold`}><stop stopColor="#947448" /><stop offset=".5" stopColor="#EAD8A2" /><stop offset="1" stopColor="#B89757" /></linearGradient>
      <linearGradient id={`${id}-fold`}><stop stopColor="#FFFFFF" stopOpacity="0" /><stop offset=".45" stopColor="#FFFFFF" stopOpacity=".14" /><stop offset="1" stopColor="#000000" stopOpacity=".16" /></linearGradient>
      <pattern id={`${id}-motif`} width="32" height="42" patternUnits="userSpaceOnUse"><path d="M16 10 Q24 17 16 24 Q8 17 16 10 M16 29 L16 34" stroke="#E8CE91" strokeWidth=".65" opacity=".4" fill="none" /></pattern>
    </defs>

    <ellipse cx="180" cy="505" rx="95" ry="12" fill="#000" opacity=".22" />
    <g data-layer="mannequin" fill={url('body')} stroke="#8D9482" strokeWidth=".7">
      <path d="M162 123 L162 154 Q144 161 129 175 L110 278 Q110 291 119 293 Q129 294 132 279 L157 208 L155 279 L145 472 Q149 483 163 478 L180 316 L197 478 Q211 483 215 472 L205 279 L203 208 L228 279 Q231 294 241 293 Q250 291 250 278 L231 175 Q216 161 198 154 L198 123 Z" />
      <ellipse cx="180" cy="102" rx="29" ry="39" />
      <path d="M154 472 Q142 482 133 482 Q125 486 131 494 L165 494 L167 475 M206 472 Q218 482 227 482 Q235 486 229 494 L195 494 L193 475" />
    </g>

    <g data-layer="bottom" data-selection={outfit.pantsOrSkirt} fill={pantsColor} stroke="#8F9286" strokeWidth=".8">
      {skirt ? <>
        <path d="M151 255 L209 255 L240 471 Q180 491 120 471 Z" />
        {[140, 158, 180, 202, 220].map(x => <path key={x} d={`M180 267 L${x} 477`} stroke={outfit.pantsOrSkirt === 'Quần lụa đen' ? '#626660' : '#C1C4B7'} opacity=".7" />)}
      </> : <>
        <path d="M151 259 L178 259 L175 477 Q156 482 137 476 Z M182 259 L209 259 L223 476 Q204 482 185 477 Z" />
        <path d="M161 283 L154 470 M199 283 L206 470" stroke={pantsColor === '#303439' ? '#5D6265' : '#CBCDC2'} fill="none" />
      </>}
    </g>

    <g data-layer="inner-robe" data-selection={outfit.innerRobe} fill={innerColor} stroke="#AAAFA1" strokeWidth=".7">
      <path d="M157 153 L163 143 Q180 151 197 143 L203 153 L220 370 Q180 384 140 370 Z" />
      <path d="M163 145 L180 170 L197 145 L190 190 L170 190 Z" stroke="#C2C4B8" />
    </g>

    <g data-layer="main-garment" data-selection={costumeId} fill={url('silk')} stroke="#BBA575" strokeWidth=".8">
      <path d={leftSleeve} /><path d={rightSleeve} /><path d={body} />
      <path d={body} fill={url('fold')} stroke="none" />
      <path d="M157 231 Q151 310 148 383 M204 231 Q212 310 216 383" fill="none" stroke="#FFF" strokeOpacity=".1" />
      {nhatBinh && <>
        <path d={body} fill={url('motif')} stroke="none" />
        <path d="M157 156 L157 247 L203 247 L203 156 L194 156 L194 237 L166 237 L166 156 Z" fill="#453729" stroke={url('gold')} strokeWidth="2" />
        <path d="M163 165 L163 241 L197 241 L197 165" fill="none" stroke={url('gold')} strokeWidth="1.2" strokeDasharray="2 5" />
        <circle cx="180" cy="296" r="17" fill="none" stroke={url('gold')} strokeWidth="1.3" />
        <path d="M168 296 Q180 280 192 296 Q180 312 168 296" fill="none" stroke={url('gold')} />
        {['#617D65', '#D7BA76', '#A9C2C5', '#F0E7D5', '#A15448'].map((fill, index) => <g key={fill} stroke="none" fill={fill}><path d={`M${72 + index * 3} ${274 + index * 4} L${119 + index} ${292 + index * 2} L${119 + index} ${296 + index * 2} L${74 + index * 3} ${278 + index * 4} Z`} /><path d={`M${288 - index * 3} ${274 + index * 4} L${241 - index} ${292 + index * 2} L${241 - index} ${296 + index * 2} L${286 - index * 3} ${278 + index * 4} Z`} /></g>)}
      </>}
      {crossCollar && <><path d="M159 150 L202 219 L199 242 L151 165 Z" fill={innerColor} /><path d="M198 150 L157 219" fill="none" stroke={url('gold')} strokeWidth="3" /><path d="M143 241 Q180 250 217 241 L218 249 Q180 258 142 249 Z" fill="#6E5140" /></>}
      {openRobe && <><path d="M157 158 L175 258 L158 393 M203 158 L185 258 L202 393" fill="none" stroke={innerColor} strokeWidth="8" /><path d="M143 249 Q180 258 217 249" fill="none" stroke="#B8995C" strokeWidth="7" /><path d="M180 251 L160 330 M184 251 L205 334" stroke="#B8995C" strokeWidth="5" /></>}
      {roundCollar && <path d="M157 157 Q180 188 203 157" stroke={innerColor} strokeWidth="5" fill="none" />}
      {style === 'Cổ thuyền' && <path d="M152 164 Q180 183 208 164" stroke={innerColor} strokeWidth="4" fill="none" />}
      {!nhatBinh && !crossCollar && !openRobe && !roundCollar && style !== 'Cổ thuyền' && <>
        <path d="M166 151 L166 141 Q180 147 194 141 L194 151" fill={outfit.colorTheme} stroke={url('gold')} strokeWidth="1.5" />
        <path d="M182 155 Q203 170 205 191 L207 363" stroke={url('gold')} fill="none" />
        {[161, 174, 189, 205, 221].map((y, index) => <circle key={y} cx={index < 2 ? 187 + index * 9 : 205} cy={y} r="2" fill={url('gold')} stroke="none" />)}
      </>}
      {style === 'Raglan' && <path d="M163 155 L147 202 M197 155 L213 202" stroke={innerColor} strokeOpacity=".6" fill="none" />}
    </g>

    <g data-layer="hands" fill={url('body')} stroke="#8D9482" strokeWidth=".7">
      <path d="M111 286 Q109 304 119 315 Q123 319 127 313 L131 287 Z M249 286 Q251 304 241 315 Q237 319 233 313 L229 287 Z" />
    </g>

    <g data-layer="footwear" data-selection={outfit.footwear}>
      {!barefoot && [false, true].map(right => <g key={String(right)} transform={right ? 'translate(360 0) scale(-1 1)' : undefined}>
        {sneakers ? <><path d="M139 475 L171 475 L174 492 L123 492 Q120 485 129 481 Z" fill="#F4F3ED" stroke="#6B7569" /><path d="M125 492 L174 492" stroke="#CDD3C6" strokeWidth="5" /><path d="M143 478 L153 489 M151 478 L161 489" stroke="#7B948C" strokeWidth="2" /></> : clogs ? <><path d="M133 478 L169 478 L173 490 L126 490 Z" fill="#B38758" stroke="#7C593B" /><path d="M137 481 Q154 470 167 481" stroke="#493C2D" strokeWidth="6" fill="none" /><path d="M135 491 L135 495 M165 491 L165 495" stroke="#7C593B" strokeWidth="5" /></> : <><path d="M138 474 L171 474 L174 491 L126 491 Q123 480 138 474 Z" fill="#314846" stroke={url('gold')} /><path d="M139 483 Q149 473 160 483 Q151 489 139 483" stroke={url('gold')} fill="none" /></>}
      </g>)}
    </g>

    {headwrap && <g data-layer="headwear" data-selection={outfit.headwear}>
      <path d="M146 89 Q146 59 180 57 Q214 59 214 89 L204 93 Q180 76 156 93 Z" fill={headColor} stroke={url('gold')} />
      <path d="M152 81 Q180 61 208 81 M152 88 Q180 69 208 88" fill="none" stroke={url('gold')} strokeWidth=".7" opacity=".7" />
      {outfit.headwear === 'Khăn đóng' && <path d="M167 86 L180 78 L193 86 M170 79 L180 71 L190 79" fill="none" stroke={url('gold')} />}
    </g>}
    {has('acc-tram') && <g data-layer="acc-tram" stroke={url('gold')} fill="#BCB8A3"><path d="M205 82 L227 56" strokeWidth="3" /><ellipse cx="224" cy="54" rx="5" ry="9" transform="rotate(30 224 54)" /><ellipse cx="231" cy="58" rx="4" ry="7" transform="rotate(70 231 58)" /><circle cx="225" cy="61" r="3" fill="#D5A97A" /></g>}
    {has('acc-sunglasses') && <g data-layer="acc-sunglasses" fill="#273031" stroke={url('gold')}><path d="M154 99 L174 99 L173 111 Q162 117 155 110 Z M186 99 L206 99 L205 110 Q198 117 187 111 Z" /><path d="M174 102 L186 102" /><path d="M157 101 L164 108 M189 101 L196 108" stroke="#FFFFFF" opacity=".25" /></g>}
    {has('acc-vong-co') && <g data-layer="acc-vong-co" fill="none"><path d="M159 154 Q180 182 201 154" stroke="#76867E" strokeWidth="6" /><path d="M159 153 Q180 178 201 153" stroke="#DEDFD0" strokeWidth="3" /></g>}
    {has('acc-khanh') && <g data-layer="acc-khanh" stroke={url('gold')} fill={url('gold')}><path d="M160 160 Q180 195 200 160" fill="none" strokeWidth="1.5" /><path d="M167 193 Q170 185 175 190 Q180 182 185 190 Q190 185 193 193 L197 198 Q180 210 163 198 Z" /><circle cx="180" cy="197" r="3" fill="#769D83" /><path d="M180 206 L180 232" strokeWidth="3" /><path d="M175 221 L175 233 M185 221 L185 233" strokeWidth="1.5" /></g>}
    {has('acc-tui-gam') && <g data-layer="acc-tui-gam"><path d="M237 306 Q265 320 242 333" fill="none" stroke={url('gold')} strokeWidth="2" /><path d="M230 329 Q252 319 270 337 L265 366 Q248 378 230 364 Z" fill="#426A53" stroke={url('gold')} /><path d="M234 337 Q249 333 265 341 M250 343 L242 352 L250 361 L258 352 Z" fill="none" stroke={url('gold')} /><path d="M249 374 L249 389" stroke={url('gold')} strokeWidth="3" /></g>}
    {has('acc-fan') && <g data-layer="acc-fan" transform="rotate(-18 119 304)"><path d="M119 304 L80 274 Q119 230 158 274 Z" fill="#E2C797" stroke="#8E704A" strokeWidth="1.2" />{[82, 97, 119, 141, 156].map(x => <path key={x} d={`M119 304 L${x} ${x === 119 ? 250 : 269}`} stroke="#8E704A" strokeWidth=".7" />)}<path d="M119 296 L119 312" stroke="#634E34" strokeWidth="4" /></g>}
  </svg>;
};
