import React, { useEffect, useState, useRef } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap, ZoomControl } from 'react-leaflet';
import { Icon } from 'leaflet';
import { FullscreenControl } from 'react-leaflet-fullscreen';
import "leaflet/dist/leaflet.css";
import "leaflet-routing-machine/dist/leaflet-routing-machine.css"; // Import routing machine CSS
import axios from 'axios';
import Footer from "./Footer";
import factoryIcon from '../assets/partner/hub.svg';
import currentLocationImage from '../assets/partner/location (3).svg';
import LeafletDirections from "./LeafletDirections";
import "leaflet-routing-machine";


export default function Partner() {
    const token = localStorage.getItem("token");
    const [username, setUsername] = useState("");
    const [history, setHistory] = useState([]);
    const [routes, setRoutes] = useState([]);
    const [pageContent, setPageContent] = useState(null);
    const [data, setData] = useState(null);
    const [order, setOrder] = useState();
    const [locations, setLocations] = useState([]);
    const [currentLocation, setCurrentLocation] = useState([11.0168, 76.9558]);
    const [locationFetched, setLocationFetched] = useState(false);
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [ismap, setmap] = useState(false);
    const [incompleteOrder, setincompleteOrder] = useState();
    const routingControlRef = useRef(null);

    useEffect(() => {
        axios.get("http://localhost:7000/getParterProfile", {
            headers: {
                "authorization": `Bearer ${token}`
            }
        }).then((response) => {
            setData(response.data);
        }).catch((error) => {
            console.error("Error fetching profile data:", error);
        });
    }, [token]);

    useEffect(() => {
        if (data) {
            setUsername(data.userData.username);
            setHistory(data.userData.takenOrders);
            setRoutes(data.routes.transportRoutes);
            setLocations(data.locations.locations);

            if (data.userData.takenOrders.length === 0) {
                let tempArray = [];
                routes.forEach(element => {
                    tempArray.push(
                        <section className="partnerPageBodyNewOrderElement" key={element.routeNo}>
                            <div className="partnerPageBodyNewOrderElementsSno">{element.routeNo}</div>
                            <div className="partnerPageBodyNewOrderElementdiv">{element.fromName}</div>
                            <div className="partnerPageBodyNewOrderElementdiv">{element.toName}</div>
                            <div className="partnerPageBodyNewOrderElementbutton"><span onClick={() => setOrder(element)}>Take Order</span></div>
                        </section>
                    );
                });
                setPageContent(
                    <section className="partnerPageBodyNewOrder">
                        <div className="partnerPageBodyNewOrderHeading">Pick a New Order</div>
                        <section className="partnerPageBodyNewOrderElement" style={{fontWeight:"600"}}>
                            <div className="partnerPageBodyNewOrderElementsSno"><span>S.No</span></div>
                            <div className="partnerPageBodyNewOrderElementdiv"><span>From</span></div>
                            <div className="partnerPageBodyNewOrderElementdiv"><span>To</span></div>
                            <div className="partnerPageBodyNewOrderElementbutton">Orders</div>
                        </section>
                        {tempArray}
                    </section>
                );
            } else {
                const hasIncompleteOrder = data.userData.takenOrders.some(order => order.status === false);
                const incompleteOrders_ = data.userData.takenOrders.filter(order => order.status === false);
                console.log(incompleteOrders_);
                if (hasIncompleteOrder) {
                    setincompleteOrder(incompleteOrders_);
                    setmap(true);
                    navigator.geolocation.getCurrentPosition(position => {
                        const { latitude, longitude } = position.coords;
                        setCurrentLocation([latitude, longitude]);
                        setLocationFetched(true);
                    }, error => {
                        console.error("Error getting current location:", error);
                    });
                    const interval = setInterval(() => {
                        navigator.geolocation.getCurrentPosition(position => {
                            const { latitude, longitude } = position.coords;
                            setCurrentLocation([latitude, longitude]);
                        }, error => {
                            console.error("Error getting current location:", error);
                        });
                    }, 2000);
                    return () => clearInterval(interval);
                } else {
                    let tempArray = [];
                    routes.forEach(element => {
                        tempArray.push(
                            <section className="partnerPageBodyNewOrderElement" key={element.routeNo}>
                                <div className="partnerPageBodyNewOrderElementsSno">{element.routeNo}</div>
                                <div className="partnerPageBodyNewOrderElementdiv">{element.fromName}</div>
                                <div
                                    className="partnerPageBodyNewOrderElementdiv">{element.toName}</div>
                                <div className="partnerPageBodyNewOrderElementbutton"><span onClick={() => setOrder(element)}>Take Order</span></div>
                            </section>
                        );
                    });
                    setPageContent(
                        <section className="partnerPageBodyNewOrder">
                            <div className="partnerPageBodyNewOrderHeading">Pick a New Order</div>
                            <section className="partnerPageBodyNewOrderElement">
                                <div className="partnerPageBodyNewOrderElementsSno"><span>S no</span></div>
                                <div className="partnerPageBodyNewOrderElementdiv"><span>From</span></div>
                                <div className="partnerPageBodyNewOrderElementdiv"><span>To</span></div>
                                <div className="partnerPageBodyNewOrderElementbutton">Take Order</div>
                            </section>
                            {tempArray}
                        </section>
                    );
                }
            }
        }
    }, [data, routes]);

    const factoryIconMarker = new Icon({
        iconUrl: factoryIcon,
        iconSize: [40, 40],
    });

    const currentLocationIcon = new Icon({
        iconUrl: currentLocationImage,
        iconSize: [32, 32],
    });

    const CenterButton = ({ position }) => {
        const map = useMap();
        const centerMap = () => {
            map.setView(position, map.getZoom());
        };

        return (
            <button className="mapLocationButton" onClick={centerMap}>
            </button>
        );
    };

    useEffect(() => {
        if (order) {
            axios.post("http://localhost:7000/setPartnerOrder", { data: order }, {
                headers: {
                    "authorization": `Bearer ${token}`
                }
            }).then((response) => {
                console.log("Order sent successfully");
                window.location.reload();
            }).catch((error) => {
                console.error("Error sending order:", error);
            });
        }
    }, [order, token]);

    const mapdata = (
        <section>
            <div className="partnerPageBodyNewOrderHeading">
                Tracking Current Order
            </div>
            <div className="map">
                <MapContainer center={currentLocation} zoom={12} style={{ height: isFullscreen ? "100vh" : "calc(64vh - 8vh)", width: isFullscreen ? "100vw" : "92vw" }} zoomControl={false}>
                    <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                    <FullscreenControl position="topright" />
                    <ZoomControl position="topleft" />

                    {locations.map((location, index) => (
                        <Marker key={index} position={location.coordinates} icon={factoryIconMarker}>
                            <Popup>{location.name}</Popup>
                        </Marker>
                    ))}

                    <Marker position={currentLocation} icon={currentLocationIcon}>
                        <Popup>Your current location</Popup>
                    </Marker>
                    {incompleteOrder && (
                        <LeafletDirections
                            order={incompleteOrder}
                            currentLocation={currentLocation}
                            routingControlRef={routingControlRef}
                        />
                    )}
                    <CenterButton position={currentLocation} />
                </MapContainer>
            </div>
        </section>
    );

    return (
        <section className="partnerPage">
            <section className="partnerPageHeader">
                Hello {username}</section>
            <section className="partnerPageBody">
                {ismap ? mapdata : pageContent}
            </section>
            <Footer />
        </section>
    );
}