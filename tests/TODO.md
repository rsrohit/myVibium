# Test Improvements TODO

Tests are functional but could be improved:

## Coverage Gaps
- [x] `element.getAttribute()` not tested
- [x] `element.boundingBox()` not tested
- [x] CLI tests still use example.com (should use the-internet.herokuapp.com)

## Auto-Wait Tests
- [x] "click waits for actionable" should test element that starts hidden and becomes visible
- [x] Remove hardcoded `setTimeout` in async-api.test.js (line 85) - rely on auto-wait

## Negative Cases
- [x] Test clicking element that disappears after find()
- [x] Test type() on non-editable element
- [x] Test click() on disabled element

## Performance
- [ ] Share browser instances within describe blocks to reduce ~1s overhead per test
- [ ] Run tests in parallel (currently sequential due to resource exhaustion issues)
