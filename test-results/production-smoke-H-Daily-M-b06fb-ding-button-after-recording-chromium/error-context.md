# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: production-smoke.spec.cjs >> H. Daily Mission Flow >> Speaking mission shows Transcribe Recording button after recording
- Location: tests\production-smoke.spec.cjs:545:3

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: locator('textarea').first()
Expected: visible
Timeout: 3000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" with timeout 3000ms
  - waiting for locator('textarea').first()

```

# Page snapshot

```yaml
- generic [ref=e3]:
  - navigation [ref=e4]:
    - generic [ref=e6]:
      - link "Deutsch Klinik C1" [ref=e7] [cursor=pointer]:
        - /url: "#/"
        - img [ref=e8]
        - generic [ref=e11]: Deutsch Klinik C1
      - generic [ref=e12]:
        - link "Dashboard" [ref=e13] [cursor=pointer]:
          - /url: "#/"
        - link "Level A1" [ref=e14] [cursor=pointer]:
          - /url: "#/level/A1"
        - link "Level A2" [ref=e15] [cursor=pointer]:
          - /url: "#/level/A2"
        - link "Level B1" [ref=e16] [cursor=pointer]:
          - /url: "#/level/B1"
        - link "Level B2" [ref=e17] [cursor=pointer]:
          - /url: "#/level/B2"
        - link "Level C1" [ref=e18] [cursor=pointer]:
          - /url: "#/level/C1"
        - link "Resources" [ref=e19] [cursor=pointer]:
          - /url: "#/resources"
        - link "Medical" [ref=e20] [cursor=pointer]:
          - /url: "#/medical"
          - img [ref=e21]
          - text: Medical
        - link "C1 Ready" [ref=e25] [cursor=pointer]:
          - /url: "#/c1-readiness"
          - img [ref=e26]
          - text: C1 Ready
        - link "FSP Hub" [ref=e30] [cursor=pointer]:
          - /url: "#/medical-fsp"
          - img [ref=e31]
          - text: FSP Hub
        - link "Mistakes" [ref=e35] [cursor=pointer]:
          - /url: "#/mistake-notebook"
          - img [ref=e36]
          - text: Mistakes
      - button [ref=e39]:
        - img [ref=e40]
  - main [ref=e46]:
    - generic [ref=e47]:
      - generic [ref=e48]:
        - heading "Today's Plan" [level=1] [ref=e49]
        - generic [ref=e50]:
          - generic [ref=e51]:
            - img [ref=e52]
            - generic [ref=e54]: Mission 3 of 8
          - link "Dashboard" [ref=e55] [cursor=pointer]:
            - /url: "#/level/A1"
            - img [ref=e56]
            - text: Dashboard
        - heading "Grammar Practice" [level=2] [ref=e59]
        - paragraph [ref=e60]: "Target: Complete 10 questions"
      - generic [ref=e61]:
        - generic [ref=e62]:
          - generic [ref=e63]: Fill in the Blank · Prepositions of Place
          - generic [ref=e64]: Question 1 of 10
        - paragraph [ref=e65]: Wir wohnen ___ Berlin. (in)
        - generic [ref=e66]:
          - textbox "Type your answer..." [ref=e67]
          - button "Check" [disabled] [ref=e68] [cursor=pointer]:
            - img [ref=e69]
            - text: Check
```

# Test source

```ts
  482 |     // Navigate through missions to reach speaking
  483 |     let maxClicks = 25;
  484 |     while (maxClicks-- > 0) {
  485 |       const bodyText = await body.textContent();
  486 |       if (bodyText.includes('Speaking') && (bodyText.includes('your spoken answer') || bodyText.includes('Write your spoken answer'))) {
  487 |         break;
  488 |       }
  489 |       const nextBtn = page.locator('button').filter({ hasText: /Next Mission|Skip.*now|See Results/ }).first();
  490 |       if (await nextBtn.isVisible({ timeout: 1000 }).catch(() => false)) {
  491 |         await nextBtn.click();
  492 |         await page.waitForTimeout(800);
  493 |       } else {
  494 |         break;
  495 |       }
  496 |     }
  497 | 
  498 |     // Check for speaking textarea
  499 |     const textarea = page.locator('textarea');
  500 |     const hasTextarea = await textarea.first().isVisible({ timeout: 3000 }).catch(() => false);
  501 |     if (hasTextarea) {
  502 |       // Check that placeholder contains hint about transcription
  503 |       const placeholder = await textarea.first().getAttribute('placeholder');
  504 |       expect(placeholder).toContain('Write your spoken answer');
  505 | 
  506 |       // Check for transcription button or fallback message
  507 |       const transcribeBtn = page.locator('button').filter({ hasText: /Start Transcription/ });
  508 |       const hasTranscribe = await transcribeBtn.isVisible({ timeout: 1000 }).catch(() => false);
  509 | 
  510 |       if (hasTranscribe) {
  511 |         const btnText = await transcribeBtn.textContent();
  512 |         expect(btnText).toContain('Transcription');
  513 |       } else {
  514 |         // Fallback: check for speech recognition not supported message
  515 |         const fallbackMsg = page.getByText(/speech recognition is not supported/i);
  516 |         if (await fallbackMsg.isVisible({ timeout: 1000 }).catch(() => false)) {
  517 |           expect(await fallbackMsg.textContent()).toContain('transcript');
  518 |         }
  519 |       }
  520 | 
  521 |       // Check for privacy note
  522 |       const privacyNote = page.getByText(/Your transcript is sent for AI feedback/i);
  523 |       if (await privacyNote.isVisible({ timeout: 1000 }).catch(() => false)) {
  524 |         expect(await privacyNote.textContent()).toContain('AI feedback');
  525 |       }
  526 | 
  527 |       // Fill in a speaking transcript
  528 |       await textarea.first().fill('Guten Tag, ich heiße Anna und lerne Deutsch.');
  529 | 
  530 |       // Check for submit/feedback button
  531 |       const submitBtn = page.locator('button').filter({ hasText: /Submit/ }).first();
  532 |       const hasSubmit = await submitBtn.isVisible({ timeout: 1000 }).catch(() => false);
  533 | 
  534 |       if (hasSubmit) {
  535 |         await submitBtn.click();
  536 |         await page.waitForTimeout(2000);
  537 |       }
  538 | 
  539 |       // After submission, check for either AI results or fallback
  540 |       const afterText = await body.textContent();
  541 |       expect(afterText.includes('Copy AI') || afterText.includes('Score') || afterText.includes('Mistakes')).toBe(true);
  542 |     }
  543 |   });
  544 | 
  545 |   test('Speaking mission shows Transcribe Recording button after recording', async ({ page }) => {
  546 |     await page.goto(LIVE_URL, { waitUntil: 'networkidle' });
  547 |     await page.waitForTimeout(1000);
  548 | 
  549 |     const startBtn = page.locator('a').filter({ hasText: /Start Today's? Plan/ }).first();
  550 |     await expect(startBtn).toBeVisible({ timeout: 5000 });
  551 |     await startBtn.click();
  552 |     await page.waitForTimeout(3000);
  553 | 
  554 |     const body = page.locator('body');
  555 | 
  556 |     // Navigate through missions to reach speaking
  557 |     let maxClicks = 25;
  558 |     while (maxClicks-- > 0) {
  559 |       const bodyText = await body.textContent();
  560 |       if (bodyText.includes('Speaking') && (bodyText.includes('your spoken answer') || bodyText.includes('Write your spoken answer'))) {
  561 |         break;
  562 |       }
  563 |       const nextBtn = page.locator('button').filter({ hasText: /Next Mission|Skip.*now|See Results/ }).first();
  564 |       if (await nextBtn.isVisible({ timeout: 1000 }).catch(() => false)) {
  565 |         await nextBtn.click();
  566 |         await page.waitForTimeout(800);
  567 |       } else {
  568 |         break;
  569 |       }
  570 |     }
  571 | 
  572 |     // Check for Start Recording button
  573 |     const recordBtn = page.locator('button').filter({ hasText: /Start Recording/ });
  574 |     const hasRecordBtn = await recordBtn.isVisible({ timeout: 2000 }).catch(() => false);
  575 |     if (hasRecordBtn) {
  576 |       // Check recording note about privacy
  577 |       const privacyNote = page.getByText(/Recording saved/i);
  578 |       await expect(privacyNote).toBeVisible({ timeout: 3000 });
  579 |     } else {
  580 |       // Audio recording not supported in test env - check for manual textarea
  581 |       const textarea = page.locator('textarea').first();
> 582 |       await expect(textarea).toBeVisible({ timeout: 3000 });
      |                              ^ Error: expect(locator).toBeVisible() failed
  583 |     }
  584 |   });
  585 | 
  586 |   test('Daily speaking mission shows record and transcribe buttons', async ({ page }) => {
  587 |     await page.goto(LIVE_URL, { waitUntil: 'networkidle' });
  588 |     await page.waitForTimeout(1000);
  589 | 
  590 |     const startBtn = page.locator('a').filter({ hasText: /Start Today's? Plan/ }).first();
  591 |     await expect(startBtn).toBeVisible({ timeout: 5000 });
  592 |     await startBtn.click();
  593 |     await page.waitForTimeout(3000);
  594 | 
  595 |     const body = page.locator('body');
  596 |     let reachedSpeaking = false;
  597 |     let maxClicks = 25;
  598 |     while (maxClicks-- > 0) {
  599 |       const bodyText = await body.textContent();
  600 |       if (bodyText.includes('Speaking') && (bodyText.includes('your spoken answer') || bodyText.includes('Write your spoken answer'))) {
  601 |         reachedSpeaking = true;
  602 |         break;
  603 |       }
  604 |       const nextBtn = page.locator('button').filter({ hasText: /Next Mission|Skip.*now|See Results/ }).first();
  605 |       if (await nextBtn.isVisible({ timeout: 1000 }).catch(() => false)) {
  606 |         await nextBtn.click();
  607 |         await page.waitForTimeout(800);
  608 |       } else {
  609 |         break;
  610 |       }
  611 |     }
  612 | 
  613 |     if (reachedSpeaking) {
  614 |       // Should show recording section
  615 |       const recordBtn = page.locator('button').filter({ hasText: /Start Recording/ });
  616 |       const hasRecordBtn = await recordBtn.isVisible({ timeout: 2000 }).catch(() => false);
  617 | 
  618 |       if (hasRecordBtn) {
  619 |         // Privacy note should be present
  620 |         const recordingNote = page.getByText(/Recording saved/i);
  621 |         await expect(recordingNote).toBeVisible({ timeout: 3000 });
  622 |       }
  623 | 
  624 |       // Textarea must exist for transcript
  625 |       const textarea = page.locator('textarea').first();
  626 |       await expect(textarea).toBeVisible({ timeout: 3000 });
  627 | 
  628 |       // Transcribe Recording button text should exist in the DOM somewhere
  629 |       // (only visible after recording, but the label is correct)
  630 |       const transcribeLabel = page.getByText(/Transcribe Recording/i);
  631 |       // Should be in DOM (may be hidden until recording state)
  632 |       const hasLabel = await transcribeLabel.isVisible({ timeout: 1000 }).catch(() => false);
  633 | 
  634 |       // Verify we can type into the textarea
  635 |       await textarea.fill('Guten Tag, ich heiße Anna und lerne Deutsch.');
  636 |       await expect(textarea).toHaveValue('Guten Tag, ich heiße Anna und lerne Deutsch.');
  637 | 
  638 |       // Submit button should exist
  639 |       const submitBtn = page.locator('button').filter({ hasText: /Submit/ }).first();
  640 |       await expect(submitBtn).toBeVisible({ timeout: 2000 });
  641 |     }
  642 |   });
  643 | 
  644 |   test('Daily lesson shows explanation content after clicking Study Lesson', async ({ page }) => {
  645 |     await page.goto(LIVE_URL, { waitUntil: 'networkidle' });
  646 |     await page.waitForTimeout(2000);
  647 | 
  648 |     // Clear state to see lesson mission
  649 |     await page.evaluate(() => localStorage.removeItem('deutsch_klinik_state'));
  650 |     await page.reload();
  651 |     await page.waitForTimeout(2000);
  652 | 
  653 |     const startBtn = page.locator('a').filter({ hasText: /Start Today's? Plan/ }).first();
  654 |     await expect(startBtn).toBeVisible({ timeout: 5000 });
  655 |     await startBtn.click();
  656 |     await page.waitForTimeout(3000);
  657 | 
  658 |     const body = page.locator('body');
  659 |     await expect(body).toContainText('Mission 1 of', { timeout: 8000 });
  660 | 
  661 |     // Click Study Lesson button
  662 |     const studyBtn = page.locator('button').filter({ hasText: /Study Lesson/ }).first();
  663 |     if (await studyBtn.isVisible({ timeout: 3000 }).catch(() => false)) {
  664 |       await studyBtn.click();
  665 |       await page.waitForTimeout(1500);
  666 | 
  667 |       // Now lesson content should be visible (explanation, examples, grammar focus etc.)
  668 |       await expect(body).toContainText('Explanation', { timeout: 3000 });
  669 |       // Also check for vocabulary or other content sections
  670 |       const hasVocabOrExamples = await body.getByText(/Key Vocabulary|Grammar Focus|Examples|Practice Questions|Summary/).first().isVisible({ timeout: 2000 }).catch(() => false);
  671 |       expect(hasVocabOrExamples).toBe(true);
  672 |     }
  673 |   });
  674 | 
  675 |   test('Grammar practice shows practicing label linked to grammar lesson', async ({ page }) => {
  676 |     await page.goto(LIVE_URL, { waitUntil: 'networkidle' });
  677 |     await page.waitForTimeout(2000);
  678 | 
  679 |     await page.evaluate(() => localStorage.removeItem('deutsch_klinik_state'));
  680 |     await page.reload();
  681 |     await page.waitForTimeout(2000);
  682 | 
```