import React from 'react';

// ✅ Original text ke andar jo sentences plagiarized nikle unhe highlight karta hai
function HighlightedText({ originalText, highlights }) {
  if (!originalText) return null;
  if (!highlights || highlights.length === 0) {
    return <p style={{ lineHeight: '1.8', whiteSpace: 'pre-wrap' }}>{originalText}</p>;
  }

  // ✅ Har highlighted sentence ka original text mein position dhoondo
  const ranges = [];
  highlights.forEach((h) => {
    const sentence = h.input_sentence;
    if (!sentence) return;
    const start = originalText.indexOf(sentence);
    if (start !== -1) {
      ranges.push({ start, end: start + sentence.length, score: h.score });
    }
  });

  // ✅ Position ke hisaab se sort karo, overlap avoid karne ke liye
  ranges.sort((a, b) => a.start - b.start);
  const merged = [];
  ranges.forEach((r) => {
    const last = merged[merged.length - 1];
    if (last && r.start < last.end) {
      last.end = Math.max(last.end, r.end);
      last.score = Math.max(last.score, r.score);
    } else {
      merged.push({ ...r });
    }
  });

  // ✅ Text ko segments mein todo — normal aur highlighted
  const segments = [];
  let cursor = 0;
  merged.forEach((r, i) => {
    if (r.start > cursor) {
      segments.push({ text: originalText.slice(cursor, r.start), highlight: false });
    }
    segments.push({
      text: originalText.slice(r.start, r.end),
      highlight: true,
      score: r.score,
      key: `h-${i}`,
    });
    cursor = r.end;
  });
  if (cursor < originalText.length) {
    segments.push({ text: originalText.slice(cursor), highlight: false });
  }

  return (
    <p style={{ lineHeight: '1.8', whiteSpace: 'pre-wrap' }}>
      {segments.map((seg, i) =>
        seg.highlight ? (
          <mark
            key={seg.key || i}
            title={`${seg.score}% similar`}
            style={{
              background: seg.score > 70 ? 'rgba(244,63,94,0.2)' : 'rgba(251,191,36,0.2)',
              color: seg.score > 70 ? '#f43f5e' : '#fbbf24',
              padding: '2px 4px',
              borderRadius: '4px',
              fontWeight: 600,
            }}
          >
            {seg.text}
          </mark>
        ) : (
          <span key={i}>{seg.text}</span>
        )
      )}
    </p>
  );
}

export default HighlightedText;
