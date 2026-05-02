// Mobile UX audit - checks critical layout issues programmatically
// Run in browser console or Node

const pages = [
  { path: '#/', name: 'Dashboard' },
  { path: '#/level/A1', name: 'Level Page' },
  { path: '#/level/A1/vocabulary', name: 'VocabularyPage' },
  { path: '#/level/A1/vocabulary/flashcards', name: 'FlashcardPage' },
  { path: '#/level/A1/grammar', name: 'GrammarPage' },
  { path: '#/level/A1/reading', name: 'ReadingPage' },
  { path: '#/level/A1/listening', name: 'ListeningPage' },
  { path: '#/level/A1/writing', name: 'WritingPage' },
  { path: '#/level/A1/speaking', name: 'SpeakingPage' },
  { path: '#/level/A1/exam', name: 'ExamPage' },
  { path: '#/mistake-notebook', name: 'MistakeNotebookPage' },
  { path: '#/resources', name: 'ResourcesPage' },
  { path: '#/medical', name: 'MedicalPage' },
];

const results = [];

function audit() {
  const issues = [];
  
  // Check horizontal overflow
  const docWidth = document.documentElement.scrollWidth;
  const viewWidth = window.innerWidth;
  if (docWidth > viewWidth + 5) {
    issues.push(`Horizontal overflow: doc=${docWidth} view=${viewWidth} (diff=${docWidth - viewWidth})`);
  }

  // Check for buttons smaller than 44px (Apple HIG min tap target)
  const smallButtons = document.querySelectorAll('button, a[href], [role="button"]');
  smallButtons.forEach(el => {
    const rect = el.getBoundingClientRect();
    const isVisible = rect.width > 0 && rect.height > 0;
    if (isVisible && (rect.width < 44 || rect.height < 44)) {
      if (rect.width > 10 && rect.height > 10) {
        const text = (el.textContent || '').trim().substring(0, 30);
        issues.push(`Small tap target: ${text} (${rect.width.toFixed(0)}x${rect.height.toFixed(0)})`);
      }
    }
  });

  // Check for elements with low color contrast
  // (basic check: look for text with light colors on dark backgrounds)
  const allEls = document.querySelectorAll('p, span, div, button, a, li');
  allEls.forEach(el => {
    const style = window.getComputedStyle(el);
    const color = style.color;
    const bg = style.backgroundColor;
    const fontSize = parseFloat(style.fontSize);
    if (color && fontSize > 0) {
      // Parse rgba
      const cMatch = color.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
      if (cMatch) {
        const cBrightness = (parseInt(cMatch[1])*299 + parseInt(cMatch[2])*587 + parseInt(cMatch[3])*114) / 1000;
        if (cBrightness < 100 && fontSize < 14) {
          const text = (el.textContent || '').trim().substring(0, 40);
          if (text.length > 0) {
            issues.push(`Low contrast: "${text}" (color brightness=${cBrightness.toFixed(0)}, font=${fontSize}px)`);
          }
        }
      }
    }
  });

  // Check for overlapping elements
  const visibleEls = Array.from(document.querySelectorAll('*'))
    .filter(el => {
      const rect = el.getBoundingClientRect();
      return rect.width > 50 && rect.height > 20 && rect.top < window.innerHeight;
    });
  for (let i = 0; i < Math.min(visibleEls.length, 200); i++) {
    for (let j = i + 1; j < Math.min(visibleEls.length, 200); j++) {
      const a = visibleEls[i].getBoundingClientRect();
      const b = visibleEls[j].getBoundingClientRect();
      if (a === b) continue;
      // Check if one contains the other - that's OK (parent/child)
      const isChild = (a.left >= b.left && a.right <= b.right && a.top >= b.top && a.bottom <= b.bottom) ||
                      (b.left >= a.left && b.right <= a.right && b.top >= a.top && b.bottom <= a.bottom);
      if (!isChild) {
        const overlapX = Math.max(0, Math.min(a.right, b.right) - Math.max(a.left, b.left));
        const overlapY = Math.max(0, Math.min(a.bottom, b.bottom) - Math.max(a.top, b.top));
        if (overlapX > 50 && overlapY > 20) {
          // Partial overlap - might be intentional (grid items touching)
          if (overlapX < a.width * 0.9 || overlapY < a.height * 0.9) {
            issues.push(`Overlap detected between elements`);
            break;
          }
        }
      }
    }
    if (issues.length > 20) break;
  }

  // Check for focusable elements without visible focus styles
  const focusable = document.querySelectorAll('button, a, input, select, textarea, [tabindex]:not([tabindex="-1"])');
  focusable.forEach(el => {
    const style = window.getComputedStyle(el);
    const outline = style.outline;
    if (outline === '0px' || outline === 'none') {
      // Check if they have a custom focus style via outline-width
      const outlineWidth = style.outlineWidth;
      if (outlineWidth === '0px') {
        // Might use box-shadow or something else - check
        const boxShadow = style.boxShadow;
        if (boxShadow === 'none') {
          // Only flag if no alternative focus style
          const onFocusRule = Array.from(document.styleSheets).some(sheet => {
            try {
              return Array.from(sheet.cssRules || []).some(rule => {
                return rule.selectorText?.includes(':focus') && 
                       (rule.style?.outline !== 'none' || rule.style?.outlineWidth !== '0px');
              });
            } catch(e) { return false; }
          });
          if (!onFocusRule) {
            const text = (el.textContent || '').trim().substring(0, 25);
            issues.push(`No focus style: "${text || el.tagName}"`);
          }
        }
      }
    }
  });

  // Check for console errors (not applicable in this context)
  // Would need to capture console.error calls

  results.push({
    page: window.location.hash || '/',
    issues: [...new Set(issues)]
  });

  return results;
}

// Navigate and audit each page
async function runAll() {
  for (const page of pages) {
    window.location.hash = page.path;
    await new Promise(r => setTimeout(r, 2000)); // wait for lazy load
    console.log(`=== ${page.name} ===`);
    const result = audit();
    console.log(`Issues: ${result[0].issues.length}`);
    result[0].issues.forEach(i => console.log(`  ${i}`));
  }
  return results;
}

runAll().then(r => {
  console.log('\n=== SUMMARY ===');
  r.forEach(pageResult => {
    console.log(`\n${pageResult.page}: ${pageResult.issues.length} issues`);
  });
});
