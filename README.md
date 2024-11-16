# RANGWENA CLASS OF 2013

```gql
model Suggestion {
  id            String    @id @default(uuid())
  user          User      @relation(fields: [userId], references: [id])
  userId        String
  content       String
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
}

model SuggestionReaction {

}

model SuggestionLike {

}

model SuggestionView {

}

model Vote {
  id            String    @id @default(uuid())
  agenda String

}
```
