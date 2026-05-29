import { CompletedSubtasksPipe } from './completed-subtasks-pipe';

describe('CompletedSubtasksPipe', () => {
  it('create an instance', () => {
    const pipe = new CompletedSubtasksPipe();
    expect(pipe).toBeTruthy();
  });
});
