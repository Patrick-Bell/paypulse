import {useEffect, useState} from 'react';
import { TextField, Card, CardContent, Box, Typography, Button, Grid, Container, Accordion, AccordionSummary, AccordionDetails , AppBar, Toolbar, Menu, MenuItem, IconButton} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import PhoneIcon from '@mui/icons-material/Phone';
import MenuIcon from '@mui/icons-material/Menu';
import { Link } from 'react-scroll';
import EmailIcon from '@mui/icons-material/Email';
import BarChartIcon from '@mui/icons-material/BarChart';
import SecurityIcon from '@mui/icons-material/Security';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Autoplay } from 'swiper/modules';
import { useNavigate } from 'react-router-dom';
import { FaTwitter, FaFacebook, FaLinkedinIn } from 'react-icons/fa'; // For Font Awesome
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/autoplay';
import '../../styles/HomePage.css'

function HomePage() {
    const navigate = useNavigate();
    const [scrollY, setScrollY] = useState(0);
    const [isNavbarVisible, setIsNavbarVisible] = useState(true);
    const [isTop, setIsTop] = useState(true);
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);
    


    const handleClick = () => {
        navigate('/register');
    };

    const navigateLogin = () => {
        navigate('/signin')
    }

   

    const handleMenuClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };


    useEffect(() => {
        let lastScrollY = window.pageYOffset;

        const handleScroll = () => {
            const currentScrollY = window.pageYOffset;

            // Show the navbar when scrolling up
            if (currentScrollY < lastScrollY) {
                setIsNavbarVisible(true);
            } else {
                setIsNavbarVisible(false); // Hide the navbar when scrolling down
            }

            // Set transparent navbar if at the top of the page
            if (currentScrollY === 0) {
                setIsTop(true);
            } else {
                setIsTop(false);
            }

            lastScrollY = currentScrollY;
        };

        window.addEventListener('scroll', handleScroll);

        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    return (
        <>
            <AppBar
                position="fixed"
                sx={{
                    backgroundColor: isTop ? 'transparent' : '#1976d2',
                    transition: 'background-color 0.3s ease',
                    transform: isNavbarVisible ? 'translateY(0)' : 'translateY(-100%)',
                    transition: 'transform 0.3s ease',
                }}
            >
                <Container maxWidth="lg">
                    <Toolbar>
                        <Typography variant="h6" component="a" href="#" sx={{ flexGrow: 1, color: '#fff', textDecoration: 'none', fontWeight: 'bold' }}>
                            PayPulse
                        </Typography>

                        {/* Desktop Menu */}
                        <Box sx={{ display: { xs: 'none', md: 'flex' }, flexGrow: 1 }}>
                            <Box component="ul" sx={{ display: 'flex', gap: '20px', listStyleType: 'none', margin: 0, padding: 0 }}>
                                <li><Link to="home" smooth={true} offset={-70} duration={500} style={{ color: '#fff', textDecoration: 'none' }}>Home</Link></li>
                                <li><Link to="features" smooth={true} offset={-70} duration={500} style={{ color: '#fff', textDecoration: 'none' }}>Features</Link></li>
                                <li><Link to="reviews" smooth={true} offset={-70} duration={500} style={{ color: '#fff', textDecoration: 'none' }}>Reviews</Link></li>
                                <li><Link to="contact" smooth={true} offset={-70} duration={500} style={{ color: '#fff', textDecoration: 'none' }}>Contact</Link></li>
                            </Box>
                        </Box>

                        <Button
                            variant="contained"
                            sx={{ backgroundColor: 'white', color: 'black' }}
                            onClick={navigateLogin}
                        >
                            Login
                        </Button>

                        {/* Mobile Menu Icon */}
                        <Box sx={{ display: { xs: 'flex', md: 'none' }, alignItems: 'center' }}>
                            <IconButton
                                size="large"
                                aria-label="menu"
                                aria-controls="menu-appbar"
                                aria-haspopup="true"
                                onClick={handleMenuClick}
                                color="inherit"
                            >
                                <MenuIcon />
                            </IconButton>
                            <Menu
                                id="menu-appbar"
                                anchorEl={anchorEl}
                                open={open}
                                onClose={handleClose}
                                sx={{ display: { xs: 'block', md: 'none' } }}
                            >
                                <MenuItem onClick={handleClose}>
                                    <Link onClick={handleClose} to="home" smooth={true} offset={-70} duration={500} style={{ color: '#1976d2', textDecoration: 'none' }}>Home</Link>
                                </MenuItem>
                                <MenuItem>
                                    <Link onClick={handleClose} to="features" smooth={true} offset={-70} duration={500} style={{ color: '#1976d2', textDecoration: 'none' }}>Features</Link>
                                </MenuItem>
                                <MenuItem onClick={handleClose}>
                                    <Link onClick={handleClose} to="reviews" smooth={true} offset={-70} duration={500} style={{ color: '#1976d2', textDecoration: 'none' }}>Reviews</Link>
                                </MenuItem>
                                <MenuItem onClick={handleClose}>
                                    <Link onClick={handleClose} to="contact" smooth={true} offset={-70} duration={500} style={{ color: '#1976d2', textDecoration: 'none' }}>Contact</Link>
                                </MenuItem>
                            </Menu>
                        </Box>
                    </Toolbar>
                </Container>
            </AppBar>

            {/* Hero Section */}
            <Box sx={{
                height: '100vh',
                position: 'relative',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                textAlign: 'center',
                padding: '0 20px',
                backgroundImage: 'url("https://images.pexels.com/photos/159888/pexels-photo-159888.jpeg?auto=compress&cs=tinysrgb&w=800")',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                overflow: 'hidden',
            }}>
                {/* Blurry and Darkened Overlay */}
                <Box
                    sx={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        background: 'rgba(0, 0, 0, 0.5)',
                        filter: 'blur(8px)',
                        zIndex: 1,
                    }}
                />
                <Container maxWidth="md" sx={{ position: 'relative', zIndex: 2 }}>
                    <Typography variant="h2" sx={{ fontWeight: 'bold', marginBottom: '20px', color: '#fff' }}>
                        Track Your Wages Efficiently with PayPulse
                    </Typography>
                    <Typography variant="body1" sx={{ fontSize: '1.2rem', marginBottom: '30px', color: '#fff' }}>
                        Stay on top of your earnings and manage your finances effortlessly.
                    </Typography>
                    <Button variant="contained" color="primary" size="large" onClick={handleClick}>
                        Get Started
                    </Button>
                </Container>
            </Box>

            {/* About Us Section */}
            <Box id="about" sx={{ padding: '60px 0', backgroundColor: '#e3f2fd' }}>
                <Container maxWidth="lg">
                    <Typography variant="h4" align="center" sx={{ marginBottom: '40px', fontWeight: 'bold' }}>About Us</Typography>
                    <Grid container spacing={4}>
                        <Grid item xs={12} md={6}>
                            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <img src="https://via.placeholder.com/500x300" alt="Team" style={{ width: '100%', height: 'auto', borderRadius: '8px' }} />
                            </Box>
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <Typography variant="h5" sx={{ marginBottom: '20px', fontWeight: 'bold' }}>Our Mission</Typography>
                            <Typography variant="body1">
                                At PayPulse, our mission is to simplify wage tracking and financial management for workers in the hospitality and retail sectors. We aim to provide a user-friendly and secure platform that helps individuals stay on top of their earnings and make informed financial decisions.
                            </Typography>
                            <Typography variant="h5" sx={{ marginTop: '40px', marginBottom: '20px', fontWeight: 'bold' }}>Our Team</Typography>
                            <Typography variant="body1">
                                Our dedicated team is comprised of professionals with extensive experience in financial technology and customer support. We are passionate about making financial management accessible and straightforward for everyone.
                            </Typography>
                        </Grid>
                    </Grid>
                </Container>
            </Box>

            {/* Features Section */}
            <Box id="features" sx={{ padding: '60px 0', backgroundColor: '#ffffff' }}>
                <Container maxWidth="lg">
                    <Typography variant="h4" align="center" sx={{ marginBottom: '40px', fontWeight: 'bold' }}>Our Features</Typography>
                    <Grid container spacing={4}>
                        {/* Feature 1 */}
                        <Grid item xs={12} md={4}>
                            <Box sx={{ textAlign: 'center' }}>
                                <AccessTimeIcon color="primary" sx={{ fontSize: 50, marginBottom: '20px' }} />
                                <Typography variant="h5" sx={{ fontWeight: 'bold', marginBottom: '10px' }}>Real-Time Tracking</Typography>
                                <Typography variant="body1">Keep track of your earnings in real-time and make informed decisions.</Typography>
                            </Box>
                        </Grid>

                        {/* Feature 2 */}
                        <Grid item xs={12} md={4}>
                            <Box sx={{ textAlign: 'center' }}>
                                <BarChartIcon color="primary" sx={{ fontSize: 50, marginBottom: '20px' }} />
                                <Typography variant="h5" sx={{ fontWeight: 'bold', marginBottom: '10px' }}>Easy Reporting</Typography>
                                <Typography variant="body1">Generate reports to understand your earnings and spending patterns.</Typography>
                            </Box>
                        </Grid>

                        {/* Feature 3 */}
                        <Grid item xs={12} md={4}>
                            <Box sx={{ textAlign: 'center' }}>
                                <SecurityIcon color="primary" sx={{ fontSize: 50, marginBottom: '20px' }} />
                                <Typography variant="h5" sx={{ fontWeight: 'bold', marginBottom: '10px' }}>Secure & Reliable</Typography>
                                <Typography variant="body1">Your data is secure with us, and our system is always up and running.</Typography>
                            </Box>
                        </Grid>
                    </Grid>
                </Container>
            </Box>

            {/* Reviews Section */}
            <Box id="reviews" sx={{ padding: '60px 0', backgroundColor: '#e3f2fd' }}>
                <Container maxWidth="lg">
                    <Typography variant="h4" align="center" sx={{ marginBottom: '20px', fontWeight: 'bold' }}>User Reviews</Typography>


                    <Swiper
                    modules={[Pagination, Autoplay]}
                    spaceBetween={20}
                    slidesPerView={2}
                    centeredSlides={true}
                    pagination={{ clickable: true }}
                    loop={true}
                    autoplay={{ delay: 3000, disableOnInteraction: false }}
                    className="swiper-container"
                    style={{ position: 'relative' }}
                    breakpoints={{
                        200: {
                            slidesPerView: 1,
                        },
                        640: {
                            slidesPerView: 1,
                        },
                        768: {
                            slidesPerView: 2,
                        },
                        1024: {
                            slidesPerView: 2,
                        },
                    }}
                >
                        <SwiperSlide>
                            <blockquote style={{ padding: '20px', textAlign: 'center' }}>
                                <Typography>"PayPulse has transformed how I track my wages. It's so easy to use!"</Typography>
                                <Typography variant="caption" display="block" sx={{ marginTop: '10px', fontWeight: 'bold' }}>- Jane Doe, Hospitality Worker</Typography>
                            </blockquote>
                        </SwiperSlide>
                        <SwiperSlide>
                            <blockquote style={{ padding: '20px', textAlign: 'center' }}>
                                <Typography>"PayPulse has transformed how I track my wages. It's so easy to use!"</Typography>
                                <Typography variant="caption" display="block" sx={{ marginTop: '10px', fontWeight: 'bold' }}>- Jane Doe, Hospitality Worker</Typography>
                            </blockquote>
                        </SwiperSlide>
                        <SwiperSlide>
                            <blockquote style={{ padding: '20px', textAlign: 'center' }}>
                                <Typography>"PayPulse has transformed how I track my wages. It's so easy to use!"</Typography>
                                <Typography variant="caption" display="block" sx={{ marginTop: '10px', fontWeight: 'bold' }}>- Jane Doe, Hospitality Worker</Typography>
                            </blockquote>
                        </SwiperSlide>
                        <SwiperSlide>
                            <blockquote style={{ padding: '20px', textAlign: 'center' }}>
                                <Typography>"PayPulse has transformed how I track my wages. It's so easy to use!"</Typography>
                                <Typography variant="caption" display="block" sx={{ marginTop: '10px', fontWeight: 'bold' }}>- Jane Doe, Hospitality Worker</Typography>
                            </blockquote>
                        </SwiperSlide>
                        <SwiperSlide>
                            <blockquote style={{ padding: '20px', textAlign: 'center' }}>
                                <Typography>"A game-changer for managing my earnings. Highly recommend!"</Typography>
                                <Typography variant="caption" display="block" sx={{ marginTop: '10px', fontWeight: 'bold' }}>- John Smith, Retail Employee</Typography>
                            </blockquote>
                        </SwiperSlide>
                    </Swiper>
                </Container>
            </Box>



            <Box id="faq" sx={{ padding: '60px 0', backgroundColor: '#f5f5f5' }}>
            <Container maxWidth="lg">
                <Typography variant="h4" align="center" sx={{ marginBottom: '40px', fontWeight: 'bold' }}>
                    Frequently Asked Questions
                </Typography>

                <Accordion>
                    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                        <Typography>What is PayPulse?</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                        <Typography>
                            PayPulse is a platform designed to help workers in the hospitality and retail sectors track their wages and manage their finances more efficiently.
                        </Typography>
                    </AccordionDetails>
                </Accordion>

                <Accordion>
                    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                        <Typography>How does PayPulse work?</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                        <Typography>
                            Users can log their earnings, view real-time updates, and PayPulse will generate monthly and yearly reports.
                        </Typography>
                    </AccordionDetails>
                </Accordion>

                <Accordion>
                    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                        <Typography>Is my financial data secure?</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                        <Typography>
                            Yes, PayPulse uses advanced encryption and security measures to ensure that your financial data is kept safe and private.
                        </Typography>
                    </AccordionDetails>
                </Accordion>

                <Accordion>
                    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                        <Typography>How can I contact support?</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                        <Typography>
                            For support, you can email us at <a href="mailto:support@paypulse.com">support@paypulse.com</a>. We aim to respond within 24 hours.
                        </Typography>
                    </AccordionDetails>
                </Accordion>

                <Accordion>
                    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                        <Typography>Are there any fees associated with PayPulse?</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                        <Typography>
                            PayPulse is completely free to use for all users. ALl our features are available to all users without no further or hidden fees.
                        </Typography>
                    </AccordionDetails>
                </Accordion>

                <Accordion>
                    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                        <Typography>Can I use PayPulse on mobile devices?</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                        <Typography>
                            Yes, PayPulse is accessible via mobile devices through our responsive website. We currently do not have a mobile app but we do plan to build one!
                        </Typography>
                    </AccordionDetails>
                </Accordion>
            </Container>
        </Box>

           {/* Contact Section */}

           <Box id="contact" sx={{ padding: '40px 0' }}>
            <Container maxWidth="xl">
                <Typography variant="h4" align="center" sx={{ marginBottom: '20px', fontWeight: 'bold' }}>
                    Contact Us
                </Typography>
                <Accordion>
                    <AccordionSummary
                        expandIcon={<ExpandMoreIcon />}
                        aria-controls="address-content"
                        id="address-header"
                    >
                        <Typography variant="h6">Address</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <LocationOnIcon sx={{ color: '#1976d2', marginRight: '10px' }} />
                            <Typography variant="body1">
                                123 Main Street,<br />
                                Suite 400,<br />
                                Cityville, ST 12345
                            </Typography>
                        </Box>
                    </AccordionDetails>
                </Accordion>
                <Accordion>
                    <AccordionSummary
                        expandIcon={<ExpandMoreIcon />}
                        aria-controls="phone-content"
                        id="phone-header"
                    >
                        <Typography variant="h6">Phone</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <PhoneIcon sx={{ color: '#1976d2', marginRight: '10px' }} />
                            <Typography variant="body1">
                                (123) 456-7890
                            </Typography>
                        </Box>
                    </AccordionDetails>
                </Accordion>
                <Accordion>
                    <AccordionSummary
                        expandIcon={<ExpandMoreIcon />}
                        aria-controls="email-content"
                        id="email-header"
                    >
                        <Typography variant="h6">Email</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <EmailIcon sx={{ color: '#1976d2', marginRight: '10px' }} />
                            <Typography variant="body1">
                                <a href="mailto:support@paypulse.com" style={{ color: '#1976d2' }}>support@paypulse.com</a>
                            </Typography>
                        </Box>
                    </AccordionDetails>
                </Accordion>
            </Container>
        </Box>



            {/* Footer */}
            <Box sx={{ backgroundColor: '#1976d2', color: '#fff', padding: '20px 0', textAlign: 'center' }}>
                <Container maxWidth="lg">
                    <Typography variant="body1">© 2024 PayPulse. All rights reserved.</Typography>
                </Container>
            </Box>
        </>
    );
}

export default HomePage;
