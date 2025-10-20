/**
 * Test meeting data service
 * This provides sample meeting data for development and testing
 */

export const sampleMeetingData = [
    {
        "id": "31e1491a-2c71-4bef-a5ec-5176bc533b25",
        "title": "Urgent Discussion on Case Strategy",
        "meetingDate": "2025-11-20",
        "startTime": "14:00:00",
        "endTime": "15:00:00",
        "status": "PENDING",
        "note": "I would like to discuss the upcoming hearing.",
        "createdAt": "2025-10-20T02:43:06.430826Z",
        "client": {
            "id": "a0147adc-330d-450b-92ef-486ac38e9583",
            "firstName": "John",
            "lastName": "Doe"
        },
        "lawyer": {
            "id": "0447473c-6df9-4024-bb5f-8598469d8cef",
            "firstName": "Sujan",
            "lastName": "Darshana"
        },
        "aCase": {
            "id": "6b984d96-d790-47b5-b1dd-bb45ed723dcb",
            "caseTitle": "John Doe vs Bassa",
            "caseNumber": "CASENO234"
        }
    },
    {
        "id": "ac95b2ef-76d5-445b-a918-93ce2ed8a8c1",
        "title": "Urgent Discussion on Case Strategy",
        "meetingDate": "2025-11-20",
        "startTime": "18:00:00",
        "endTime": "19:00:00",
        "status": "ACCEPTED",
        "note": "This time is unavailable. Proposing a new time: 2025-11-21 at 10:00. Lawyer's note: Sorry, I'm in court at that time. Does this new time work for you?",
        "createdAt": "2025-10-20T02:43:51.931500Z",
        "client": {
            "id": "a0147adc-330d-450b-92ef-486ac38e9583",
            "firstName": "John",
            "lastName": "Doe"
        },
        "lawyer": {
            "id": "0447473c-6df9-4024-bb5f-8598469d8cef",
            "firstName": "Sujan",
            "lastName": "Darshana"
        },
        "aCase": {
            "id": "6b984d96-d790-47b5-b1dd-bb45ed723dcb",
            "caseTitle": "John Doe vs Bassa",
            "caseNumber": "CASENO234"
        }
    },
    {
        "id": "94a65258-763f-403e-a51b-eb6267185740",
        "title": "This Should Fail - Overlapping Time",
        "meetingDate": "2025-11-21",
        "startTime": "10:30:00",
        "endTime": "11:30:00",
        "status": "PENDING",
        "note": "Testing the conflict detection.",
        "createdAt": "2025-10-20T02:55:47.431380Z",
        "client": {
            "id": "a0147adc-330d-450b-92ef-486ac38e9583",
            "firstName": "John",
            "lastName": "Doe"
        },
        "lawyer": {
            "id": "0447473c-6df9-4024-bb5f-8598469d8cef",
            "firstName": "Sujan",
            "lastName": "Darshana"
        },
        "aCase": {
            "id": "6b984d96-d790-47b5-b1dd-bb45ed723dcb",
            "caseTitle": "John Doe vs Bassa",
            "caseNumber": "CASENO234"
        }
    },
    {
        "id": "4ee6c5b3-4447-4f6c-8fc7-70593621555b",
        "title": "HUtto mata MEEtimak daala deepnkooooooo",
        "meetingDate": "2025-10-22",
        "startTime": "11:01:00",
        "endTime": "15:10:00",
        "status": "PENDING",
        "note": "me mata meka daaala one hode haminenne nathuwa daala deepn",
        "createdAt": "2025-10-20T03:30:29.541295Z",
        "client": {
            "id": "a0147adc-330d-450b-92ef-486ac38e9583",
            "firstName": "John",
            "lastName": "Doe"
        },
        "lawyer": {
            "id": "0447473c-6df9-4024-bb5f-8598469d8cef",
            "firstName": "Sujan",
            "lastName": "Darshana"
        },
        "aCase": {
            "id": "6b984d96-d790-47b5-b1dd-bb45ed723dcb",
            "caseTitle": "John Doe vs Bassa",
            "caseNumber": "CASENO234"
        }
    },
    {
        "id": "d63a9a3e-15c2-4d4d-b431-f4800841dd3b",
        "title": "mehemai hutto haminenna epa harida",
        "meetingDate": "2025-10-30",
        "startTime": "09:14:00",
        "endTime": "14:14:00",
        "status": "PENDING",
        "note": "mata meeka daala deepnkoo",
        "createdAt": "2025-10-20T03:43:26.199598Z",
        "client": {
            "id": "a0147adc-330d-450b-92ef-486ac38e9583",
            "firstName": "John",
            "lastName": "Doe"
        },
        "lawyer": {
            "id": "0447473c-6df9-4024-bb5f-8598469d8cef",
            "firstName": "Sujan",
            "lastName": "Darshana"
        },
        "aCase": {
            "id": "6b984d96-d790-47b5-b1dd-bb45ed723dcb",
            "caseTitle": "John Doe vs Bassa",
            "caseNumber": "CASENO234"
        }
    }
];

/**
 * Mock function to get all meeting requests
 * In production, this would be replaced by the actual API call
 */
export const getMockMeetingRequests = () => {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(sampleMeetingData);
        }, 500); // Simulate network delay
    });
};

/**
 * Mock function to create a meeting request
 * In production, this would be replaced by the actual API call
 */
export const createMockMeetingRequest = (meetingData) => {
    return new Promise((resolve) => {
        setTimeout(() => {
            const newMeeting = {
                id: Date.now().toString(),
                ...meetingData,
                status: "PENDING",
                createdAt: new Date().toISOString(),
                client: {
                    id: "a0147adc-330d-450b-92ef-486ac38e9583",
                    firstName: "John",
                    lastName: "Doe"
                },
                lawyer: {
                    id: "0447473c-6df9-4024-bb5f-8598469d8cef",
                    firstName: "Sujan",
                    lastName: "Darshana"
                },
                aCase: {
                    id: meetingData.caseId,
                    caseTitle: "Mock Case Title",
                    caseNumber: "MOCK001"
                }
            };
            resolve(newMeeting);
        }, 500);
    });
};

/**
 * Mock function to update a meeting request
 * In production, this would be replaced by the actual API call
 */
export const updateMockMeetingRequest = (meetingId, updateData) => {
    return new Promise((resolve) => {
        setTimeout(() => {
            const meeting = sampleMeetingData.find(m => m.id === meetingId);
            if (meeting) {
                const updatedMeeting = {
                    ...meeting,
                    status: updateData.newStatus,
                    rescheduledDate: updateData.rescheduledDate,
                    rescheduledStartTime: updateData.rescheduledStartTime,
                    rescheduledEndTime: updateData.rescheduledEndTime,
                    note: updateData.note || meeting.note
                };
                resolve(updatedMeeting);
            } else {
                throw new Error('Meeting not found');
            }
        }, 500);
    });
};
