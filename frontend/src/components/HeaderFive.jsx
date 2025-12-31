import React, { useEffect, useState, useRef } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { Icon } from "@iconify/react/dist/iconify.js";
import { jwtDecode } from "jwt-decode";
import axios from "axios";
import API_BASE_URL from "../config";
import { useContext } from "react";
import { CartContext } from "../context/CartContext";

const HeaderFive = () => {
  const [active, setActive] = useState(false);
  const [scroll, setScroll] = useState(false);
  const { cartCount } = useContext(CartContext);
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState("");
  const [userRole, setUserRole] = useState("");
  const [profile_image, setProfileImage] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const dropdownTimeoutRef = useRef(null);

  // Search states
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const searchRef = useRef(null);

  // Function to fetch user data
  const fetchUserData = () => {
    const token = localStorage.getItem("accessToken");
  
    if (token) {
      try {
        const decoded = jwtDecode(token);
        const userId = decoded.user_id;

        axios
          .get(`${API_BASE_URL}api/auth/user/get_user_data/${userId}/`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          })
          .then((res) => {
            const { username, profile_image, role_id } = res.data;
            setIsLoggedIn(true);
            setUserName(username);
            setProfileImage(profile_image);
            
            let userRole = "";
            if (role_id == 1) {
              userRole = "Admin";
            } else if (role_id == 2) {
              userRole = "Staff";
            } else {
              userRole = "Customer";
            }
          
            setUserRole(userRole);
          })
          .catch((err) => {
            console.error("Error fetching user data:", err);
            setIsLoggedIn(false);
            setUserName("Guest");
            setUserRole("User");
          });
  
      } catch (error) {
        console.error("Invalid token:", error);
        setIsLoggedIn(false);
        setUserName("Guest");
        setUserRole("User");
      }
    } else {
      setIsLoggedIn(false);
      setUserName("Guest");
      setUserRole("User");
    }
  };

  // Search functionality
  const handleSearch = async (query) => {
    setSearchQuery(query);
    
    if (query.trim().length < 2) {
      setSearchResults([]);
      setShowSearchResults(false);
      return;
    }

    setIsSearching(true);
    try {
      const response = await axios.get(`${API_BASE_URL}api/home/search-parts/?q=${query}`);
      setSearchResults(response.data);
      setShowSearchResults(true);
    } catch (error) {
      console.error("Error searching parts:", error);
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  const handlePartClick = (partId) => {
    setShowSearchResults(false);
    setSearchQuery("");
    setSearchResults([]);
    navigate(`/shop-details/${partId}`);
  };

  // Handle dropdown open/close with hover and click
  const handleDropdownOpen = () => {
    if (dropdownTimeoutRef.current) {
      clearTimeout(dropdownTimeoutRef.current);
    }
    setIsDropdownOpen(true);
  };

  const handleDropdownClose = () => {
    dropdownTimeoutRef.current = setTimeout(() => {
      setIsDropdownOpen(false);
    }, 200);
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const closeDropdown = () => {
    setIsDropdownOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSearchResults(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      if (dropdownTimeoutRef.current) {
        clearTimeout(dropdownTimeoutRef.current);
      }
    };
  }, []);

  useEffect(() => {
    var offCanvasNav = document.getElementById("offcanvas-navigation");
    if (!offCanvasNav) return;
    
    var offCanvasNavSubMenu = offCanvasNav.querySelectorAll(".sub-menu");

    for (let i = 0; i < offCanvasNavSubMenu.length; i++) {
      offCanvasNavSubMenu[i].insertAdjacentHTML(
        "beforebegin",
        "<span class='mean-expand-class'>+</span>"
      );
    }

    var menuExpand = offCanvasNav.querySelectorAll(".mean-expand-class");
    var numMenuExpand = menuExpand.length;

    function sideMenuExpand() {
      if (this.parentElement.classList.contains("active") === true) {
        this.parentElement.classList.remove("active");
      } else {
        for (let i = 0; i < numMenuExpand; i++) {
          menuExpand[i].parentElement.classList.remove("active");
        }
        this.parentElement.classList.add("active");
      }
    }

    for (let i = 0; i < numMenuExpand; i++) {
      menuExpand[i].addEventListener("click", sideMenuExpand);
    }
    
    window.onscroll = () => {
      if (window.pageYOffset < 150) {
        setScroll(false);
      } else if (window.pageYOffset > 150) {
        setScroll(true);
      }
      return () => (window.onscroll = null);
    };
  }, []);

  useEffect(() => {
    fetchUserData();
  }, []);

  useEffect(() => {
    const handleProfileUpdate = () => {
      fetchUserData();
    };

    window.addEventListener('profileUpdated', handleProfileUpdate);
    return () => {
      window.removeEventListener('profileUpdated', handleProfileUpdate);
    };
  }, []);

  const mobileMenu = () => {
    setActive(!active);
  };

  useEffect(() => {
    const fetchCartCount = async () => {
      const token = localStorage.getItem("accessToken");
      if (!token) return;
  
      try {
        const res = await axios.get(`${API_BASE_URL}api/home/cart/count/`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
      } catch (error) {
        console.error("Error fetching cart count:", error);
      }
    };
  
    if (isLoggedIn) {
      fetchCartCount();
    }
  }, [isLoggedIn]);

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    setIsLoggedIn(false);
    closeDropdown();
    navigate("/login"); 
  };

  return (
    <header className="nav-header header-layout4 header-container" >
      <div className={`sticky-wrapper ${scroll && "sticky"} header-top bg-white`}>
        <div className="container ">
          <div className="row justify-content-around justify-content-md-between align-items-center gy-2">
            <div className="col-auto d-lg-block">
              <div className="header-logo">
                <Link to="/">
                  <img src={`${process.env.PUBLIC_URL}/assets/img/gowri-shankar-logo.png`} alt="Fixturbo" className="main-logo" />
                </Link>
              </div>
            </div>
            
            {/* Search Box */}
            <div className="col-auto d-none d-md-block">
              <div className="header-search-wrap" ref={searchRef} style={{ position: 'relative' }}>
                <form className="search-form rounded-full" onSubmit={(e) => e.preventDefault()} style={{background:"#f6f6f6"}}>
                  <input 
                    className="form-control px-5" 
                    type="text" 
                    placeholder="Find your product"
                    value={searchQuery}
                    onChange={(e) => handleSearch(e.target.value)}
                    onFocus={() => searchResults.length > 0 && setShowSearchResults(true)}
                  />
                  <button className="icon-btn rounded-full" type="button">
                    <i className={isSearching ? "fas fa-spinner fa-spin" : "fas fa-search"}></i>
                  </button>
                </form>

                {showSearchResults && searchResults.length > 0 && (
                  <div style={{
                    position: 'absolute', top: '100%', left: 0, right: 0,
                    backgroundColor: 'white', border: '1px solid #ddd', borderRadius: '4px',
                    marginTop: '5px', maxHeight: '400px', overflowY: 'auto', zIndex: 1000,
                    boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
                  }}>
                    {searchResults.map((part) => (
                      <div key={part.id} onClick={() => handlePartClick(part.id)}
                        style={{
                          padding: '12px 16px', cursor: 'pointer', borderBottom: '1px solid #f0f0f0',
                          display: 'flex', alignItems: 'center', gap: '12px',
                          transition: 'background-color 0.2s'
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f8f9fa'}
                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'white'}
                      >
                        {part.product_image && (
                          <img src={part.product_image} alt={part.product_name}
                            style={{ width: '50px', height: '50px', objectFit: 'cover', borderRadius: '4px' }}
                          />
                        )}
                        <div style={{ flex: 1 }}>
                          <div style={{ fontWeight: '500', color: '#333', marginBottom: '4px' }}>
                            {part.product_name}
                          </div>
                          <div style={{ fontSize: '12px', color: '#666' }}>
                            {part.part_group?.name} • ₹{part.sale_price || part.price}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {showSearchResults && searchQuery.length >= 2 && searchResults.length === 0 && !isSearching && (
                  <div style={{
                    position: 'absolute', top: '100%', left: 0, right: 0,
                    backgroundColor: 'white', border: '1px solid #ddd', borderRadius: '4px',
                    marginTop: '5px', padding: '20px', textAlign: 'center', color: '#666',
                    zIndex: 1000, boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
                  }}>
                    No parts found for "{searchQuery}"
                  </div>
                )}
              </div>
            </div>

            <div className="col-auto">
              <div className="header-user-wrap">
                <ul>
                  <li>
                    <div className="header-grid-wrap">
                      <div className="simple-icon"></div>
                      <div className="header-grid-details">
                        <h6 className="header-grid-title">
                          <div 
                            className='dropdown header-icon-text'
                            ref={dropdownRef}
                            onMouseEnter={isLoggedIn ? handleDropdownOpen : undefined}
                            onMouseLeave={isLoggedIn ? handleDropdownClose : undefined}
                          >
                            <button
                              className='d-flex justify-content-center align-items-center rounded-circle'
                              type='button'
                              onClick={isLoggedIn ? toggleDropdown : () => navigate('/login')}
                              style={{ cursor: 'pointer' }}
                              aria-expanded={isDropdownOpen}
                            >
                              <svg width={23} height={22} viewBox="0 0 23 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M11.4642 0.48653C10.3922 0.48653 9.39616 0.758532 8.47616 1.30253C7.55616 1.84653 6.82416 2.57853 6.28016 3.49853C5.73616 4.41853 5.46416 5.41453 5.46416 6.48653C5.46416 7.55853 5.73616 8.55453 6.28016 9.47453C6.82416 10.3945 7.55616 11.1265 8.47616 11.6705C9.39616 12.2145 10.3922 12.4865 11.4642 12.4865C12.5362 12.4865 13.5322 12.2185 14.4522 11.6825C15.3722 11.1465 16.1042 10.4185 16.6482 9.49853C17.1922 8.57853 17.4642 7.57453 17.4642 6.48653C17.4642 5.39853 17.1962 4.39453 16.6602 3.47453C16.1242 2.55453 15.3962 1.82653 14.4762 1.29053C13.5562 0.754532 12.5522 0.48653 11.4642 0.48653ZM11.4642 10.4945C10.7442 10.4945 10.0762 10.3145 9.46016 9.95453C8.84416 9.59453 8.35616 9.10653 7.99616 8.49053C7.63616 7.87453 7.45616 7.20653 7.45616 6.48653C7.45616 5.76653 7.63616 5.10253 7.99616 4.49453C8.35616 3.88653 8.84416 3.40253 9.46016 3.04253C10.0762 2.68253 10.7442 2.50253 11.4642 2.50253C12.1842 2.50253 12.8522 2.68253 13.4682 3.04253C14.0842 3.40253 14.5722 3.88653 14.9322 4.49453C15.2922 5.10253 15.4722 5.76653 15.4722 6.48653C15.4722 7.20653 15.2922 7.87453 14.9322 8.49053C14.5722 9.10653 14.0842 9.59453 13.4682 9.95453C12.8522 10.3145 12.1842 10.4945 11.4642 10.4945ZM0.976156 21.5105C1.28016 21.6385 1.57616 21.7665 1.86416 21.8945L1.88816 21.8225C1.90416 21.7745 1.93216 21.7305 1.97216 21.6905C2.01216 21.6505 2.08816 21.5425 2.20016 21.3665L2.36816 21.1025C2.65616 20.5905 3.19216 19.9585 3.97616 19.2065C4.82416 18.4065 5.80816 17.7745 6.92816 17.3105C8.28816 16.7665 9.79216 16.4945 11.4402 16.4945C13.0882 16.4945 14.6082 16.7825 16.0002 17.3585C17.0882 17.8065 18.0802 18.4225 18.9762 19.2065C19.6482 19.7985 20.1762 20.4305 20.5602 21.1025C20.6402 21.1985 20.7202 21.3265 20.8002 21.4865C20.8802 21.5985 20.9282 21.6705 20.9442 21.7025C20.9602 21.7345 20.9842 21.7665 21.0162 21.7985C21.0482 21.8305 21.0642 21.8545 21.0642 21.8705C21.0642 21.8865 21.0642 21.8945 21.0642 21.8945L21.9762 21.5105L22.8642 21.1025V21.0065C22.8642 20.9745 22.8482 20.9425 22.8162 20.9105C22.7842 20.8785 22.7602 20.8385 22.7442 20.7905C22.7282 20.7425 22.6802 20.6625 22.6002 20.5505C22.4562 20.3425 22.3442 20.1585 22.2642 19.9985C21.7042 19.1665 21.0722 18.4305 20.3682 17.7905C19.2962 16.8465 18.1202 16.1025 16.8402 15.5585C15.1922 14.8545 13.4322 14.5025 11.5602 14.5025C9.62416 14.5025 7.86416 14.8385 6.28016 15.5105C4.96816 16.0545 3.80016 16.8145 2.77616 17.7905C2.05616 18.4305 1.41616 19.1665 0.856156 19.9985L0.688156 20.2625C0.528156 20.5185 0.424156 20.6945 0.376156 20.7905C0.328156 20.8385 0.296156 20.8865 0.280156 20.9345L0.256156 21.0065V21.1025C0.192156 21.1025 0.160156 21.1105 0.160156 21.1265C0.160156 21.1425 0.224156 21.1745 0.352156 21.2225L0.976156 21.5105Z" fill="#1B1F22"/>
                              </svg>
                            </button>
                        
                            {isLoggedIn && isDropdownOpen && (
                              <div className="dropdown-menu to-top dropdown-menu-sm" style={{ display: 'block' }}>
                                <div className='py-12 px-16 radius-8 bg-primary-50 mb-16 d-flex align-items-center justify-content-between gap-2'>
                                  <div className='d-flex align-items-center gap-3'>
                                    {profile_image && profile_image.trim() !== "" ? (
                                      <img style={{width: "50px", height: "50px", borderRadius: "50%", objectFit: "cover"}}
                                        src={profile_image}
                                        onError={(e) => {e.target.src = `${process.env.PUBLIC_URL}/assets/img/default-avatar.png`;}}
                                        alt="Profile"
                                      />
                                    ) : (
                                      <div>👤</div>
                                    )}
                                    <div>
                                      <h6 className='text-lg text-primary-light fw-semibold mb-2'>{userName}</h6>
                                      <span className='text-secondary-light fw-medium text-sm'>{userRole}</span>
                                    </div>
                                  </div>
                                  <button type='button' className='hover-text-danger' onClick={closeDropdown}>
                                    <Icon icon='radix-icons:cross-1' className='icon text-xl' />
                                  </button>
                                </div>

                                <ul className="to-top-list">
                                  <li>
                                    <Link className="dropdown-item text-black px-0 py-8 hover-bg-transparent hover-text-primary d-flex align-items-center gap-3"
                                      to="/view-profile" onClick={closeDropdown}
                                    >
                                      <Icon icon="solar:user-linear" className="icon text-xl" /> My Profile
                                    </Link>
                                  </li>
                                  <li>
                                    <Link className="dropdown-item text-black px-0 py-8 hover-bg-transparent hover-text-primary d-flex align-items-center gap-3"
                                      to="/forgot-password" onClick={closeDropdown}
                                    >
                                      <Icon icon="tabler:lock" className="icon text-xl" /> Change Password
                                    </Link>
                                  </li>
                                  {userRole !== "Admin" && (
                                    <li>
                                      <Link className="dropdown-item text-black px-0 py-8 hover-bg-transparent hover-text-primary d-flex align-items-center gap-3"
                                        to="/orders" onClick={closeDropdown}
                                      >
                                        <Icon icon="mdi:package-variant-closed" className="icon text-xl" /> My Orders
                                      </Link>
                                    </li>
                                  )}
                                  <li>
                                    <button className="dropdown-item text-black px-0 py-8 hover-bg-transparent hover-text-danger d-flex align-items-center gap-3 border-0 bg-transparent"
                                      onClick={handleLogout}
                                    >
                                      <Icon icon="lucide:power" className="icon text-xl" /> Log Out
                                    </button>
                                  </li>
                                </ul>
                              </div>
                            )}
                            
                            <div className="">
                              {isLoggedIn ? (
                                <h6 className="header-grid-title">{userName}</h6>
                              ) : (
                                <>
                                  <span className="header-grid-text" style={{ cursor: 'pointer' }} onClick={() => navigate('/login')}>
                                    Sign In
                                  </span>
                                  <h6 className="header-grid-title" style={{ cursor: 'pointer' }} onClick={() => navigate('/login')}>
                                    Account
                                  </h6>
                                </>
                              )}
                            </div>
                          </div>
                        </h6>
                      </div>
                    </div>
                  </li>
                  <li></li>
                  <li>
                    {isLoggedIn ? (
                      <div className="header-grid-wrap">
                        <div className="simple-icon">
                          <Link to="/cart">
                            <svg clipRule="evenodd" fillRule="evenodd" height="27" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="2" viewBox="0 0 48 48" width="27" xmlns="http://www.w3.org/2000/svg">
                              <g transform="translate(-53 -212)"><g transform="translate(-355 -60)"><g id="ngicon"><path d="m422.519 285.5h-2.657c-1.836 0-3.36 1.419-3.491 3.251l-1.714 24c-.069.969.267 1.923.929 2.634.663.711 1.59 1.115 2.562 1.115h27.704c.972 0 1.899-.404 2.562-1.115.662-.711.998-1.665.929-2.634l-1.714-24c-.131-1.832-1.655-3.251-3.491-3.251h-2.638v-.5c0-5.247-4.253-9.5-9.5-9.5-5.055 0-9.727 4.026-9.5 9.5.007.166.013.333.019.5zm18.981 3v7.5c0 .828-.672 1.5-1.5 1.5s-1.5-.672-1.5-1.5v-7.5h-13v7.5c0 .828-.672 1.5-1.5 1.5s-1.5-.672-1.5-1.5c0 0 .13-3.505.087-7.5h-2.725c-.262 0-.48.203-.498.464 0 0-1.715 24-1.715 24-.01.139.038.275.133.377.095.101.227.159.366.159h27.704c.139 0 .271-.058.366-.159.095-.102.143-.238.133-.377l-1.715-24c-.018-.261-.236-.464-.498-.464zm-3-3v-.5c0-3.59-2.91-6.5-6.5-6.5-3.59 0-6.5 2.91-6.5 6.5v.5z"/></g></g></g>
                            </svg>
                            <span className="badge">{cartCount}</span>
                          </Link>
                        </div>
                      </div>
                    ) : (
                      <div className="header-grid-wrap">
                        <div className="simple-icon">
                          <Link to="/cart">
                            <svg clipRule="evenodd" fillRule="evenodd" height="27" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="2" viewBox="0 0 48 48" width="27" xmlns="http://www.w3.org/2000/svg">
                              <g transform="translate(-53 -212)"><g transform="translate(-355 -60)"><g id="ngicon"><path d="m422.519 285.5h-2.657c-1.836 0-3.36 1.419-3.491 3.251l-1.714 24c-.069.969.267 1.923.929 2.634.663.711 1.59 1.115 2.562 1.115h27.704c.972 0 1.899-.404 2.562-1.115.662-.711.998-1.665.929-2.634l-1.714-24c-.131-1.832-1.655-3.251-3.491-3.251h-2.638v-.5c0-5.247-4.253-9.5-9.5-9.5-5.055 0-9.727 4.026-9.5 9.5.007.166.013.333.019.5zm18.981 3v7.5c0 .828-.672 1.5-1.5 1.5s-1.5-.672-1.5-1.5v-7.5h-13v7.5c0 .828-.672 1.5-1.5 1.5s-1.5-.672-1.5-1.5c0 0 .13-3.505.087-7.5h-2.725c-.262 0-.48.203-.498.464 0 0-1.715 24-1.715 24-.01.139.038.275.133.377.095.101.227.159.366.159h27.704c.139 0 .271-.058.366-.159.095-.102.143-.238.133-.377l-1.715-24c-.018-.261-.236-.464-.498-.464zm-3-3v-.5c0-3.59-2.91-6.5-6.5-6.5-3.59 0-6.5 2.91-6.5 6.5v.5z"/></g></g></g>
                            </svg>
                          </Link>
                        </div>
                      </div>
                    )}
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

     <div className={`sticky-wrapper ${scroll && "sticky"}`}>
    <div className={`mobile-menu-wrapper ${active && "body-visible"}`}>
      <div className="mobile-menu-area">
        <div className="mobile-logo">
          <Link to="/"><img src={`${process.env.PUBLIC_URL}/assets/img/gowri-shankar-logo.png`} alt="Fixturbo" /></Link>
          <button className="menu-toggle" onClick={mobileMenu}><i className="fa fa-times" /></button>
        </div>
        <div className="mobile-menu">
          <ul id="offcanvas-navigation">
            <li className="menu-item-has-children submenu-item-has-children">
              <Link to="/About">About</Link>
            </li>
            <li>
              <NavLink to="/contact" className={(navData) => (navData.isActive ? "active" : "")}>
                Contact
              </NavLink>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</header>
  );
};

export default HeaderFive;