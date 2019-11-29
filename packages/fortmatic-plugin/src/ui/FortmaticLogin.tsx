import React from 'react';
import styled from 'styled-components';

const ModalWrapper = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  height: 100%;
  width: 100%;
  animation: .3s forwards modal-wrapper-reveal;
  background: #EEEEEE99;
`;

const ContentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

const ModalBase = styled.div`
  display: flex;
  flex-direction: column;
  max-width: 350px;
  height: fit-content;
  margin: 10px;
  overflow: hidden;
  border-radius: 14px;
  animation: .3s forwards modal-enter;
  will-change: transform,opacity;
  background: white;
  box-shadow: 0 0 30px rgba(0,0,0,.3);
`;

const LogoContainer = styled.div`
  position: absolute;
  width: 69px;
  height: 69px;
  top: 24px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 1;
`;

const Button = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  position: relative;
  height: 60px;
  padding: 10px 20px;
  cursor: pointer;
  border-radius: 7px;
  color: white;
  background: #6851FF;
`;

const FortmaticLogin: React.FC<{ onClick: () => void }> = ({ onClick }) => {
  return (
    <ModalWrapper>
      <ContentWrapper>
        <ModalBase>
          <div className="NavigationBar-component" style={{ height: '60px' }}>
            <div className="modal-actions">
              <div className="right">
                <div className="close-button">
                  <span>
                    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                      <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path fillRule="evenodd" clipRule="evenodd" d="M7.10488 5.17206L2.00521 -0.00012207L0.405903 1.62193L5.50558 6.79411L3.05176e-05 12.3779L1.59934 14L7.10488 8.41616L12.4007 13.7873L14 12.1652L8.70419 6.79411L13.5941 1.83463L11.9948 0.212587L7.10488 5.17206Z" fill="#FFFFFF" fillOpacity="1" />
                      </svg>
                    </div>
                  </span>
                </div>
              </div>
              <LogoContainer>
                <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAIoAAACKCAYAAAB1h9JkAAAACXBIWXMAABYlAAAWJQFJUiTwAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAJNSURBVHgB7dwxalRBAIDhidhEKyWdhYU2KVIplramFK1EsLYTz+ABPIW30UpvoaQzKSODCBaR/CQhO4nfB8uWu8XPzLw3w2wdHR4fDzjFjQGBUEiEQiIUEqGQCIVEKCRCIREKiVBIhEIiFBKhkAiFRCgkQiERColQSIRCIhQSoZAIhUQoJEIhEQqJUEiEQiIUEqGQCIVEKCRCIREKiVBIhEIiFBKhkNwci3r/evyXPn4aSzKikAiFRCgkQiERColQSIRCIhQSoZAIhUQoJEIhEQqJUEiWPWZwHg93x3iwO7hA1zKUGcn+y8EFMvWQCIVEKCRCIREKiVBIhEIiFBKhkAiFRCgkQiERColQSK7lMYPz+vBujIMfYyNce8GVJhQSoZAIhUQoJEIhEQqJUEiEQiIUEqGQCIVEKCRCIXHM4ATP34xx9HOcydcvY3z7PK4doZxg79E4s4PvZw9l+9ZYlqlnIdu3x7KEspA7O2NZQlnIvftjWUJZyN7jsSyhLOLuzu9LClcllEU8W/xyQqEsYI4mT56OpQllAa/ejuUJZcPmlLPy2uQPoWzQjGT/xbgShLIhVymSyV7PJZsL17kmuQrTzd+Ecknm/fzzyWb1p5t/WTaU8+x7bHJzbf72/O/ze76Sn585eqz8er7YOjo8Ph5wCotZEqGQCIVEKCRCIREKiVBIhEIiFBKhkAiFRCgkQiERColQSIRCIhQSoZAIhUQoJEIhEQqJUEiEQiIUEqGQCIVEKCRCIREKiVBIhEIiFBKhkAiFRCgkQiH5BbHuJLVqcU0PAAAAAElFTkSuQmCC" alt="Fortmatic Logo" />
              </LogoContainer>
            </div>
          </div>
          <div className="page-container">
            <div style={{transition: 'height 0.2s ease 0s', height: '394px', willChange: 'height' }}>
              <div style={{ position: 'relative' }}>
                <div className="modal-page">
                  <div className="PageTransition-component" style={{ opacity: 1, transform: 'none' }}>
                    <div style={{ position: 'relative' }}>
                      <div>
                        <div className="UserVerifyBlock-component">
                          <div style={{ position: 'relative' }}>
                            <div>
                              <div className="description-header">Connect via Fortmatic</div>
                            </div>
                            <div>
                              <div className="description">To continue using this app</div>
                            </div>
                            <div>
                              <div className="PopTransition-component" style={{ opacity: 1, transform: 'none' }}>
                                <div className="PhoneInput-component has-focus">
                                  <div className="country-code-container">
                                    <div className="country-code">
                                      <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAWCAYAAAChWZ5EAAAAAXNSR0IArs4c6QAAAYdJREFUSA1jzBZWid0sGzzvHasICwMIMDOBKYa//yA0EXwmDjaG6iO5EPXEky///2dIZQFZ/pZRkIXhz1+IVhgNM4gIPtSpMB3E0uKMjAyzWcA+B1qyc14KA1CAIabhAtiAxfUGRPOZ2VgYUnf/INZisLop85aCaHFoeDOALQPaDwcgxxDN/w/XRjKDBRznwBAgx+cw25jYmBneGanAuETR7PefgNXBQwCmiySfQzUhhxTMHGJpFlhqJyXOQYYjq//7+y+D0Lk7xNoJVvcTkgYY4CFAqs9R1I+mAZICH1XxaBpg5LHo/f//528GMXkT1LAhgcfKzc6w7VQkCToYGNZCywEWUEUCKstBxSkDMDWDChVQvgZlLWL57LwcJFmOrJilJJCLgZ1dgCE12gJZnAw2heUAGTZSRQtjJwsooBkYghVlqGIgsYbA0gC8JCRWI7XVsfzsnQtMA2wMQtGh1DYbr3kYdQFe1TSUBKWBF0DzxWloBz6jnzGBGoZAFa/wqaKR3DOg3RkAkQetByWulPUAAAAASUVORK5CYII=" alt="" />
                                      <div>+1</div>
                                    </div>
                                  </div>
                                  <div className="TextInput-component has-focus">
                                    <input placeholder="415 555 2671" pattern="\d*" autoComplete="off" maxLength={12} />
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div>
                              <a className="toggle-verification-type">Use Email Instead</a>
                            </div>
                          <div>
                            <div className="cta-button-container">
                              <Button onClick={onClick}>
                                <div className="button-label">
                                  <div className="not-loading">
                                    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                      <svg width="17" height="17" version="1.1" id="L9" xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" viewBox="25 25 50 50">
                                        <path fill="#FFFFFF" fillOpacity="1" d="M73,50c0-12.7-10.3-23-23-23S27,37.3,27,50 M30.9,50c0-10.5,8.5-19.1,19.1-19.1S69.1,39.5,69.1,50" transform="rotate(107.281 50 50)">
                                          <animateTransform attributeName="transform" attributeType="XML" type="rotate" dur="0.5s" from="0 50 50" to="360 50 50" repeatCount="indefinite" />
                                        </path>
                                      </svg>
                                    </div>
                                  </div>
                                  Sign Up / Log In
                                </div>
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="footer-container">
            <div className="Footer-component">
              <div className="separator-container">
                <div className="Separator-component" />
              </div>
            <div className="secured-by-fortmatic-label">
              <div>Secured by</div>
              <svg width="71" height="14" viewBox="0 0 71 14" xmlns="http://www.w3.org/2000/svg">
                <path d="M19.792 11H21.496V7.664H25.372V6.2H21.496V4.46H25.456V2.996H19.792V11ZM29.2995 11.144C31.2195 11.144 32.3715 9.752 32.3715 8.096C32.3715 6.452 31.2195 5.06 29.2995 5.06C27.3915 5.06 26.2395 6.452 26.2395 8.096C26.2395 9.752 27.3915 11.144 29.2995 11.144ZM29.2995 9.788C28.3515 9.788 27.8235 9.008 27.8235 8.096C27.8235 7.196 28.3515 6.416 29.2995 6.416C30.2475 6.416 30.7875 7.196 30.7875 8.096C30.7875 9.008 30.2475 9.788 29.2995 9.788ZM33.5021 11H35.0261V7.172C35.2781 6.8 35.9501 6.524 36.4541 6.524C36.6221 6.524 36.7661 6.536 36.8741 6.56V5.072C36.1541 5.072 35.4341 5.48 35.0261 5.996V5.204H33.5021V11ZM39.7703 11.144C40.4063 11.144 40.8143 10.976 41.0423 10.772L40.7183 9.62C40.6343 9.704 40.4183 9.788 40.1903 9.788C39.8543 9.788 39.6623 9.512 39.6623 9.152V6.536H40.8383V5.204H39.6623V3.62H38.1263V5.204H37.1663V6.536H38.1263V9.56C38.1263 10.592 38.7023 11.144 39.7703 11.144ZM49.069 11H50.605V6.812C50.605 5.624 49.969 5.06 48.901 5.06C48.013 5.06 47.245 5.588 46.909 6.116C46.693 5.456 46.153 5.06 45.301 5.06C44.413 5.06 43.645 5.612 43.405 5.96V5.204H41.881V11H43.405V7.1C43.633 6.776 44.077 6.416 44.605 6.416C45.229 6.416 45.469 6.8 45.469 7.34V11H47.005V7.088C47.221 6.776 47.665 6.416 48.205 6.416C48.829 6.416 49.069 6.8 49.069 7.34V11ZM55.5798 11H57.1038V7.256C57.1038 5.588 55.8918 5.06 54.5718 5.06C53.6598 5.06 52.7478 5.348 52.0398 5.972L52.6158 6.992C53.1077 6.536 53.6838 6.308 54.3078 6.308C55.0758 6.308 55.5798 6.692 55.5798 7.28V8.084C55.1958 7.616 54.5117 7.376 53.7438 7.376C52.8198 7.376 51.7278 7.868 51.7278 9.224C51.7278 10.52 52.8198 11.144 53.7438 11.144C54.4998 11.144 55.1838 10.868 55.5798 10.4V11ZM55.5798 9.608C55.3278 9.944 54.8478 10.112 54.3558 10.112C53.7558 10.112 53.2638 9.8 53.2638 9.26C53.2638 8.708 53.7558 8.384 54.3558 8.384C54.8478 8.384 55.3278 8.552 55.5798 8.888V9.608ZM60.5594 11.144C61.1954 11.144 61.6034 10.976 61.8314 10.772L61.5074 9.62C61.4234 9.704 61.2074 9.788 60.9794 9.788C60.6434 9.788 60.4514 9.512 60.4514 9.152V6.536H61.6274V5.204H60.4514V3.62H58.9154V5.204H57.9554V6.536H58.9154V9.56C58.9154 10.592 59.4914 11.144 60.5594 11.144ZM63.4261 4.352C63.9301 4.352 64.3381 3.944 64.3381 3.44C64.3381 2.936 63.9301 2.528 63.4261 2.528C62.9341 2.528 62.5141 2.936 62.5141 3.44C62.5141 3.944 62.9341 4.352 63.4261 4.352ZM62.6701 11H64.1941V5.204H62.6701V11ZM65.3332 8.096C65.3332 9.884 66.6172 11.144 68.4052 11.144C69.5932 11.144 70.3132 10.628 70.6972 10.088L69.7012 9.164C69.4252 9.548 69.0052 9.788 68.4772 9.788C67.5532 9.788 66.9052 9.104 66.9052 8.096C66.9052 7.088 67.5532 6.416 68.4772 6.416C69.0052 6.416 69.4252 6.644 69.7012 7.04L70.6972 6.116C70.3132 5.576 69.5932 5.06 68.4052 5.06C66.6172 5.06 65.3332 6.32 65.3332 8.096Z" />
                <path fillRule="evenodd" clipRule="evenodd" d="M7.0002 0H10.5003H14.0004V3.50011H10.5003H7.0002H3.5001V7.0002V7.22462V10.4799V10.5003V13.98H0V10.5003V10.4799V7.22462V7.0002V3.50011V0H3.5001H7.0002ZM10.4994 10.4798H7.01971V7.00012H13.9975V10.6022C13.9975 11.4977 13.6419 12.3565 13.0089 12.9899C12.3759 13.6233 11.5173 13.9794 10.6218 13.9799H10.4994V10.4798Z" />
              </svg>
            </div>
          </div>
        </div>
      </div>
        </ModalBase>
      </ContentWrapper>
    </ModalWrapper>
  );
};

export default FortmaticLogin;
