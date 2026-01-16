# System Flowcharts - SPA Purchasing System

This document outlines the core workflows of the Purchasing Request (PR) system using Mermaid diagrams.

## 1. Purchase Request (PR) Approval Flow

This flowchart describes the lifecycle of a Purchase Request from creation to final approval or rejection.

```mermaid
flowchart TD
    Start([User Creates PR]) --> Init[Status: Pending KTU Approval]
    
    Init --> CheckKTU{KTU Action}
    
    CheckKTU -- Approve --> Mgr[Status: Pending Manager Approval]
    CheckKTU -- Reject --> Rejected[Status: Rejected]
    
    Mgr --> CheckMgr{Manager Action}
    
    CheckMgr -- Approve --> Approved[Status: Fully Approved]
    CheckMgr -- Reject --> Rejected
    
    Rejected --> End([End Logic])
    Approved --> End
```

## 2. Notification System Flow

This flowchart describes how WhatsApp notifications are triggered based on status changes.

```mermaid
sequenceDiagram
    participant U as Requester
    participant K as KTU
    participant M as Manager
    participant S as System
    
    U->>S: Create PR
    S->>K: Notify "New PR Pending Approval"
    
    alt KTU Approves
        K->>S: Approve PR
        S->>M: Notify "PR from [Requester] needs Approval"
        
        alt Manager Approves
            M->>S: Approve PR
            S->>U: Notify "PR Fully Approved"
        else Manager Rejects
            M->>S: Reject PR (Reason)
            S->>U: Notify "PR Rejected" + Reason
        end
        
    else KTU Rejects
        K->>S: Reject PR (Reason)
        S->>U: Notify "PR Rejected" + Reason
    end
```

## 3. Rejection Logic Detail

```mermaid
flowchart LR
    A[Reject Button Clicked] --> B{Prompt Reason}
    B -- Cancel --> C[Cancel Action]
    B -- Submit Reason --> D[Send API Request]
    D --> E{API Success?}
    E -- Yes --> F[Update Status 'Rejected'] --> G[Save Reason in DB] --> H[Notify Requester]
    E -- No --> I[Show Error Alert]
```
