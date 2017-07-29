import { AngularrepairPage } from './app.po';

describe('angularrepair App', () => {
  let page: AngularrepairPage;

  beforeEach(() => {
    page = new AngularrepairPage();
  });

  it('should display welcome message', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('Welcome to app!!');
  });
});
