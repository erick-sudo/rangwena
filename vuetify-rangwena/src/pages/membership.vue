<!-- <template>
  <v-container>
    <v-card elevation="3" class="mb-5">
      <v-card-title>Membership Registration</v-card-title>
      <v-card-text>
        <v-form ref="form" v-model="valid">
          <v-text-field
            v-model="newMember.name"
            label="Name"
            :rules="[rules.required]"
            required
          ></v-text-field>
          <v-text-field
            v-model="newMember.email"
            label="Email"
            :rules="[rules.required, rules.email]"
            required
          ></v-text-field>
          <v-select
            v-model="newMember.membershipType"
            :items="membershipTypes"
            label="Membership Type"
            :rules="[rules.required]"
            required
          ></v-select>
          <v-btn
            :disabled="!valid"
            @click="registerMember"
            color="primary"
            class="mt-3"
          >
            Register
          </v-btn>
        </v-form>
      </v-card-text>
    </v-card>

    <v-card elevation="3">
      <v-card-title>Active Members</v-card-title>
      <v-card-text>
        <v-list>
          <v-list-item v-for="member in members" :key="member.id">
            <v-list-item-title>{{ member.name }}</v-list-item-title>
            <v-list-item-subtitle>
              {{ member.email }} - {{ member.membershipType }}
            </v-list-item-subtitle>
            <v-list-item-action>
              <v-btn icon color="red" @click="removeMember(member.id)">
                <v-icon>mdi-delete</v-icon>
              </v-btn>
            </v-list-item-action>
          </v-list-item>
        </v-list>
      </v-card-text>
    </v-card>
  </v-container>
</template> -->

<!-- <script lang="ts" setup>
interface Member {
  id: number;
  name: string;
  email: string;
  membershipType: string;
}

const members = reactive<Member[]>([]);
const membershipTypes = ref(["Basic", "Premium", "VIP"]);
const newMember = reactive<Member>({
  id: 0,
  name: "",
  email: "",
  membershipType: "",
});

const valid = ref(false);
const rules = {
  required: (value: string) => !!value || "This field is required",
  email: (value: string) => /.+@.+\..+/.test(value) || "E-mail must be valid",
};

const registerMember = () => {
  const id = members.length + 1;
  members.push({ ...newMember, id });
  Object.assign(newMember, { id: 0, name: "", email: "", membershipType: "" });
};

const removeMember = (id: number) => {
  const index = members.findIndex((member) => member.id === id);
  if (index !== -1) members.splice(index, 1);
};
</script> -->
<template>
  <under-construction></under-construction>
</template>
<route lang="yaml">
meta:
  layout: index
</route>
