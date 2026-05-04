# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: production-smoke.spec.cjs >> H. Daily Mission Flow >> Daily lesson shows explanation content after clicking Study Lesson
- Location: tests\production-smoke.spec.cjs:644:3

# Error details

```
Error: expect(locator).toContainText(expected) failed

Locator: locator('body')
Timeout: 3000ms
- Expected substring  - 1
+ Received string     + 6

- Explanation
+
+     Deutsch Klinik C1DK C1DashboardLevel A1Level A2Level B1Level B2Level C1Resources Medical C1 Ready FSP Hub MistakesToday's PlanMission 1 of 8 DashboardStudy a LessonTarget: Study 1 lessonBegruessungen und Vorstellungen Mark Lesson Complete Skip for now
+
+   
+
+

Call log:
  - Expect "toContainText" with timeout 3000ms
  - waiting for locator('body')
    7 × locator resolved to <body>…</body>
      - unexpected value "
    Deutsch Klinik C1DK C1DashboardLevel A1Level A2Level B1Level B2Level C1Resources Medical C1 Ready FSP Hub MistakesToday's PlanMission 1 of 8 DashboardStudy a LessonTarget: Study 1 lessonBegruessungen und Vorstellungen Mark Lesson Complete Skip for now

  

"

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
            - generic [ref=e55]: Mission 1 of 8
          - link "Dashboard" [ref=e56] [cursor=pointer]:
            - /url: "#/level/A1"
            - img [ref=e57]
            - text: Dashboard
        - heading "Study a Lesson" [level=2] [ref=e60]
        - paragraph [ref=e61]: "Target: Study 1 lesson"
      - generic [ref=e63]:
        - heading "Begruessungen und Vorstellungen" [level=3] [ref=e64]
        - generic [ref=e65]:
          - button "Mark Lesson Complete" [ref=e66] [cursor=pointer]:
            - img [ref=e67]
            - text: Mark Lesson Complete
          - button "Skip for now" [ref=e70] [cursor=pointer]:
            - img [ref=e71]
            - text: Skip for now
```

# Test source

```ts
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
  582 |       await expect(textarea).toBeVisible({ timeout: 3000 });
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
> 668 |       await expect(body).toContainText('Explanation', { timeout: 3000 });
      |                          ^ Error: expect(locator).toContainText(expected) failed
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
  683 |     const startBtn = page.locator('a').filter({ hasText: /Start Today's? Plan/ }).first();
  684 |     await expect(startBtn).toBeVisible({ timeout: 5000 });
  685 |     await startBtn.click();
  686 |     await page.waitForTimeout(3000);
  687 | 
  688 |     const body = page.locator('body');
  689 | 
  690 |     // Navigate through missions to reach grammar practice
  691 |     for (let i = 0; i < 8; i++) {
  692 |       const txt = await body.textContent().catch(() => '');
  693 |       if (txt.includes('Grammar Practice') && (txt.includes('Question') || txt.includes('Type your answer'))) break;
  694 |       const skipBtn = page.locator('button').filter({ hasText: /Skip|Next Mission|Mark Lesson Complete/ }).first();
  695 |       if (await skipBtn.isVisible({ timeout: 2000 }).catch(() => false)) {
  696 |         await skipBtn.click();
  697 |         await page.waitForTimeout(1000);
  698 |       }
  699 |     }
  700 | 
  701 |     // Grammar practice should have type/input rendering
  702 |     const txt = await body.textContent();
  703 |     if (txt.includes('Grammar Practice')) {
  704 |       // Check either text input or options are rendered
  705 |       const hasInput = await page.locator('input[type="text"]').first().isVisible({ timeout: 2000 }).catch(() => false);
  706 |       const hasOptions = await page.locator('button').filter({ hasText: /^[A-Z]\)|^der |^die |^das / }).first().isVisible({ timeout: 1000 }).catch(() => false);
  707 |       expect(hasInput || hasOptions).toBe(true);
  708 |     }
  709 |   });
  710 | 
  711 |   test('Fill-blank question shows text input and Check button', async ({ page }) => {
  712 |     await page.goto(LIVE_URL, { waitUntil: 'networkidle' });
  713 |     await page.waitForTimeout(2000);
  714 | 
  715 |     await page.evaluate(() => localStorage.removeItem('deutsch_klinik_state'));
  716 |     await page.reload();
  717 |     await page.waitForTimeout(2000);
  718 | 
  719 |     const startBtn = page.locator('a').filter({ hasText: /Start Today's? Plan/ }).first();
  720 |     await expect(startBtn).toBeVisible({ timeout: 5000 });
  721 |     await startBtn.click();
  722 |     await page.waitForTimeout(3000);
  723 | 
  724 |     const body = page.locator('body');
  725 | 
  726 |     // Navigate through missions to reach grammar practice
  727 |     for (let i = 0; i < 8; i++) {
  728 |       const txt = await body.textContent().catch(() => '');
  729 |       if (txt.includes('Fill in the Blank') || txt.includes('Type your answer')) break;
  730 |       const skipBtn = page.locator('button').filter({ hasText: /Skip|Next Mission|Mark Lesson Complete/ }).first();
  731 |       if (await skipBtn.isVisible({ timeout: 2000 }).catch(() => false)) {
  732 |         await skipBtn.click();
  733 |         await page.waitForTimeout(1000);
  734 |       }
  735 |     }
  736 | 
  737 |     // Look for the text input and Check button
  738 |     const textInput = page.locator('input[type="text"]').first();
  739 |     const hasInput = await textInput.isVisible({ timeout: 3000 }).catch(() => false);
  740 |     if (hasInput) {
  741 |       await textInput.fill('test answer');
  742 |       const checkBtn = page.locator('button').filter({ hasText: /Check/ }).first();
  743 |       await expect(checkBtn).toBeVisible({ timeout: 1000 });
  744 |       await checkBtn.click();
  745 |       await page.waitForTimeout(500);
  746 | 
  747 |       // After checking, feedback should appear
  748 |       await expect(body).toContainText(/Correct|Incorrect/, { timeout: 3000 });
  749 |     }
  750 |   });
  751 | 
  752 |   test('Grammar completion shows review screen', async ({ page }) => {
  753 |     await page.goto(LIVE_URL, { waitUntil: 'networkidle' });
  754 |     await page.waitForTimeout(2000);
  755 | 
  756 |     await page.evaluate(() => localStorage.removeItem('deutsch_klinik_state'));
  757 |     await page.reload();
  758 |     await page.waitForTimeout(2000);
  759 | 
  760 |     const startBtn = page.locator('a').filter({ hasText: /Start Today's? Plan/ }).first();
  761 |     await expect(startBtn).toBeVisible({ timeout: 5000 });
  762 |     await startBtn.click();
  763 |     await page.waitForTimeout(3000);
  764 | 
  765 |     const body = page.locator('body');
  766 | 
  767 |     // Navigate through all missions to reach grammar practice completion
  768 |     for (let i = 0; i < 10; i++) {
```