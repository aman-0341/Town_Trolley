import React, { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet-routing-machine";
import { useMap } from "react-leaflet";

export default function LeafletDirections(props) {
    const map = useMap();
    const routingControlRef = useRef(null);
    
    useEffect(() => { 
        if (!map || !props || !props.order || !props.currentLocation) return;

        const incompleteOrder = props.order.find(order => order.status === false);
        if (!incompleteOrder) return;

        if (!routingControlRef.current) {
            routingControlRef.current = L.Routing.control({
                waypoints: [
                    L.latLng(props.currentLocation[0], props.currentLocation[1]),
                    L.latLng(incompleteOrder.from[0], incompleteOrder.from[1])
                ],
                show: false,
                createMarker: function(i, waypoint, n) {
                    
                    return L.marker(waypoint.latLng, {
                        opacity: 0  // Set opacity to 0 for transparent markers
                    });
                }
            }).addTo(map);
        } else {
            routingControlRef.current = L.Routing.control({
                waypoints: [
                    L.latLng(props.currentLocation[0], props.currentLocation[1]),
                    L.latLng(incompleteOrder.from[0], incompleteOrder.from[1])
                ],
                show: false,
                createMarker: function(i, waypoint, n) {
                    // Customize marker options
                    return L.marker(waypoint.latLng, {
                        opacity: 0  // Set opacity to 0 for transparent markers
                    });
                }
            }).addTo(map);
        }

        return () => {
            if (routingControlRef.current) {
                routingControlRef.current.setWaypoints([]);
            }
        };
    }, [map, props]);

    return null;
}
