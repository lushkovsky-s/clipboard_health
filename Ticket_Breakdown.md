# Ticket Breakdown
We are a staffing company whose primary purpose is to book Agents at Shifts posted by Facilities on our platform. We're working on a new feature which will generate reports for our client Facilities containing info on how many hours each Agent worked in a given quarter by summing up every Shift they worked. Currently, this is how the process works:

- Data is saved in the database in the Facilities, Agents, and Shifts tables
- A function `getShiftsByFacility` is called with the Facility's id, returning all Shifts worked that quarter, including some metadata about the Agent assigned to each
- A function `generateReport` is then called with the list of Shifts. It converts them into a PDF which can be submitted by the Facility for compliance.

## You've been asked to work on a ticket. It reads:

**Currently, the id of each Agent on the reports we generate is their internal database id. We'd like to add the ability for Facilities to save their own custom ids for each Agent they work with and use that id when generating reports for them.**


Based on the information given, break this ticket down into 2-5 individual tickets to perform. Provide as much detail for each ticket as you can, including acceptance criteria, time/effort estimates, and implementation details. Feel free to make informed guesses about any unknown details - you can't guess "wrong".


You will be graded on the level of detail in each ticket, the clarity of the execution plan within and between tickets, and the intelligibility of your language. You don't need to be a native English speaker, but please proof-read your work.

## Your Breakdown Here

### Step 0. Research
Check the db itself and data organization
Guess 1: we're working with SQL-like DB (because: 1) we call it "tables" in the description 2) it's the most popular choice 3) it fits the product needs). So, it's probable MySQL or PostgreSQL

Guess 2: The schema should look like
Facilities
| Field | Type   |
|-------|--------|
| id    | PKEY   |
| name  | String |

Agents
| Field | Type   |
| --    | --     |
| id    | PKEY   |
| name  | String | 

Shifts
| Field       | Type                     |
| --          | --                       |
| id          | PKEY                     |
| name        | String                   |
| quarter     | Number                   |
| year        | Number                   |
| facility_id | FOREIGNKEY -> Facilities | 

AgentsToShifts 
| Field    | Type                 |
| --       | --                   |
| agent_id | FOREIGNKEY -> Agents |
| shift_id | FOREIGNKEY -> Shifts | 

### Step 1. Schema changes
As we need to add an extra id for an agent for some specific Facility - we have create another M2M relation (=mapping table). 
Guess 3: This is not a cost-effective solution, but we'll not optimize it as our product looks as a low load B2B instrument. Options to optimize: keep the id under AgentsToShifts (no extra join needed), add materialized view to (to prevent joins when no updates happened), invent some id generation policy or template (will allow us to not save it)

AgentFacilityCard
| Field             | Type                     |
| ---               | --                       |
| agent_id          | FOREIGNKEY -> Agents     |
| facility_id       | FOREIGNKEY -> Facilities |
| agent_external_id | String                   | 

In the most cases this change will result in creating a migration file for our ORM.

### Step 2. Methods changes
Now we'll need to change the logic of our JS methods.
We'll need to add an extra JOIN inside the PDF generation logic, which will allow us to get the "external" id for the report.

### Step 3. Harmonize the code
Check all the places where we e.g. create new Agents/Facilities or their relationships. Create AgentFacilityCard (as we need to set is somewhere, e.g. by some HTTP POST request or something else)
